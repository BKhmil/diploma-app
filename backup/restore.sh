#!/bin/sh
#
# restore.sh — restore the database (and uploaded files) from a specific backup.
#
# Run this ON THE SERVER, from the project root (where docker-compose.yml lives):
#
#   ./backup/restore.sh                       # list available backups and exit
#   ./backup/restore.sh latest                # restore the newest backup
#   ./backup/restore.sh backup_2026-06-07_22-29.sql.gz   # restore a specific one
#   ./backup/restore.sh latest -y             # skip the confirmation prompt
#
# What it does (safely):
#   1. Takes a SAFETY backup of the current state first (so a wrong restore is undoable).
#   2. Stops the backend so nothing writes during the restore.
#   3. Drops & recreates the database, then loads the chosen dump.
#   4. Restores the matching uploaded files (if that backup includes them).
#   5. Starts the backend again.
#
set -eu

# Always operate from the project root (the directory above this script).
cd "$(dirname "$0")/.."

BACKUP_DIR="./backups"
UPLOADS_DIR="./backend/public/uploads"
COMPOSE="docker compose"

# --- helpers ---------------------------------------------------------------

# Run a shell snippet inside the postgres container. DB credentials are read
# from the container's own environment, so we never have to parse .env here.
pg() {
	$COMPOSE exec -T postgres sh -c "$1"
}

list_backups() {
	echo "Available database backups in ${BACKUP_DIR}:"
	echo ""
	if ls -1t "${BACKUP_DIR}"/backup_*.sql.gz >/dev/null 2>&1; then
		# show newest first, with size and whether a matching uploads archive exists
		for f in $(ls -1t "${BACKUP_DIR}"/backup_*.sql.gz); do
			base="$(basename "$f")"
			ts="$(echo "$base" | sed -e 's/^backup_//' -e 's/\.sql\.gz$//')"
			size="$(du -h "$f" | cut -f1)"
			if [ -f "${BACKUP_DIR}/uploads_${ts}.tar.gz" ]; then
				files="+ files"
			else
				files="(db only)"
			fi
			printf "  %-40s %6s  %s\n" "$base" "$size" "$files"
		done
	else
		echo "  (none yet — backups are created automatically every 12h,"
		echo "   or run: ${COMPOSE} exec backup /usr/local/bin/backup.sh once)"
	fi
	echo ""
	echo "Restore with:  ./backup/restore.sh <filename>   (or 'latest')"
}

# --- resolve which backup to restore --------------------------------------

if [ "$#" -eq 0 ]; then
	list_backups
	exit 0
fi

SELECTED="$1"
ASSUME_YES="no"
[ "${2:-}" = "-y" ] || [ "${2:-}" = "--yes" ] && ASSUME_YES="yes"

if [ "$SELECTED" = "latest" ]; then
	BACKUP_FILE="$(ls -1t "${BACKUP_DIR}"/backup_*.sql.gz 2>/dev/null | head -n 1 || true)"
	if [ -z "$BACKUP_FILE" ]; then
		echo "[restore] No backups found in ${BACKUP_DIR}." >&2
		exit 1
	fi
else
	# accept either a bare filename or a path
	case "$SELECTED" in
		*/*) BACKUP_FILE="$SELECTED" ;;
		*)   BACKUP_FILE="${BACKUP_DIR}/${SELECTED}" ;;
	esac
	if [ ! -f "$BACKUP_FILE" ]; then
		echo "[restore] Backup not found: ${BACKUP_FILE}" >&2
		echo "" >&2
		list_backups >&2
		exit 1
	fi
fi

TS="$(basename "$BACKUP_FILE" | sed -e 's/^backup_//' -e 's/\.sql\.gz$//')"
UPLOADS_ARCHIVE="${BACKUP_DIR}/uploads_${TS}.tar.gz"

echo "About to restore:"
echo "  database : ${BACKUP_FILE}"
if [ -f "$UPLOADS_ARCHIVE" ]; then
	echo "  uploads  : ${UPLOADS_ARCHIVE}"
else
	echo "  uploads  : (none in this backup — current files left untouched)"
fi
echo ""
echo "This REPLACES the current database. A safety backup is taken first."

if [ "$ASSUME_YES" != "yes" ]; then
	printf "Type 'yes' to continue: "
	read -r answer
	[ "$answer" = "yes" ] || { echo "[restore] Aborted."; exit 1; }
fi

# --- 0. make sure postgres is up ------------------------------------------

echo "[restore] Ensuring database is running..."
$COMPOSE up -d postgres >/dev/null 2>&1 || true
# wait for it to accept connections (max ~60s)
i=0
until pg 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"' >/dev/null 2>&1; do
	i=$((i + 1))
	[ "$i" -ge 30 ] && { echo "[restore] Postgres did not become ready." >&2; exit 1; }
	sleep 2
done

# --- 1. safety backup of the CURRENT state --------------------------------

SAFETY_TS="$(date '+%Y-%m-%d_%H-%M')"
SAFETY="${BACKUP_DIR}/backup_pre-restore_${SAFETY_TS}.sql.gz"
echo "[restore] Saving safety backup of current state → ${SAFETY}"
pg 'PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$SAFETY"
# Snapshot current uploads too, so the safety backup is a complete pair (db + files)
# and a roll-back also restores the files. Naming matches what restore expects.
if [ -d "$UPLOADS_DIR" ]; then
	tar -czf "${BACKUP_DIR}/uploads_pre-restore_${SAFETY_TS}.tar.gz" -C "$UPLOADS_DIR" . 2>/dev/null || true
fi

# --- 2. stop the app so nothing writes during the restore -----------------

echo "[restore] Stopping backend + backup..."
$COMPOSE stop backend backup >/dev/null 2>&1 || true

# --- 3. drop, recreate, and load the dump ---------------------------------

echo "[restore] Recreating database..."
pg 'PGPASSWORD="$POSTGRES_PASSWORD" dropdb -U "$POSTGRES_USER" --if-exists --force "$POSTGRES_DB"'
pg 'PGPASSWORD="$POSTGRES_PASSWORD" createdb -U "$POSTGRES_USER" -O "$POSTGRES_USER" "$POSTGRES_DB"'

echo "[restore] Loading ${BACKUP_FILE}..."
# --single-transaction = all-or-nothing; ON_ERROR_STOP aborts on the first error.
# stdout is discarded (it's just sequence-reset chatter); real errors go to stderr.
gunzip -c "$BACKUP_FILE" | pg 'PGPASSWORD="$POSTGRES_PASSWORD" psql -q --single-transaction -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null'

# --- 4. restore uploaded files (if this backup has them) ------------------

if [ -f "$UPLOADS_ARCHIVE" ]; then
	echo "[restore] Restoring uploaded files..."
	mkdir -p "$UPLOADS_DIR"
	# replace current files with the snapshot's files
	find "$UPLOADS_DIR" -mindepth 1 -delete 2>/dev/null || true
	tar -xzf "$UPLOADS_ARCHIVE" -C "$UPLOADS_DIR"
fi

# --- 5. bring the app back -------------------------------------------------

echo "[restore] Starting backend + backup..."
$COMPOSE up -d backend backup >/dev/null 2>&1

echo ""
echo "[restore] Done. Restored from ${BACKUP_FILE}"
echo "[restore] (If anything looks wrong, you can restore the safety backup:"
echo "[restore]   ./backup/restore.sh $(basename "$SAFETY") )"
