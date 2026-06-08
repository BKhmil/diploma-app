#!/bin/sh
set -eu

BACKUP_DIR="/backups"
# Source of uploaded files (mounted read-only from the backend's uploads dir).
UPLOADS_SRC="/uploads-src"
INTERVAL_SECONDS=43200
MAX_BACKUPS=14

mkdir -p "$BACKUP_DIR"

run_backup() {
  timestamp="$(date '+%Y-%m-%d_%H-%M')"
  output_file="${BACKUP_DIR}/backup_${timestamp}.sql.gz"

  echo "[backup] Creating ${output_file}"
  pg_dump \
    -h "${POSTGRES_HOST}" \
    -p "${POSTGRES_PORT}" \
    -U "${POSTGRES_USER}" \
    "${POSTGRES_DB}" | gzip > "${output_file}"

  # Snapshot uploaded files alongside the DB dump (same timestamp = a matching pair),
  # so a restore brings back both the records and the actual files.
  if [ -d "${UPLOADS_SRC}" ]; then
    uploads_file="${BACKUP_DIR}/uploads_${timestamp}.tar.gz"
    echo "[backup] Archiving uploads → ${uploads_file}"
    tar -czf "${uploads_file}" -C "${UPLOADS_SRC}" . 2>/dev/null || echo "[backup] (uploads archive skipped)"
  fi

  echo "[backup] Rotating old backups (keep ${MAX_BACKUPS})"
  ls -1t "${BACKUP_DIR}"/backup_*.sql.gz 2>/dev/null | awk "NR>${MAX_BACKUPS}" | xargs -r rm -f
  ls -1t "${BACKUP_DIR}"/uploads_*.tar.gz 2>/dev/null | awk "NR>${MAX_BACKUPS}" | xargs -r rm -f
  echo "[backup] Done"
}

if [ "${1:-}" = "once" ]; then
  run_backup
  exit 0
fi

while true; do
  run_backup
  echo "[backup] Sleeping for ${INTERVAL_SECONDS} seconds"
  sleep "${INTERVAL_SECONDS}"
done
