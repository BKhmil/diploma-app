#!/bin/sh
set -eu

BACKUP_DIR="/backups"
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

  echo "[backup] Rotating old backups (keep ${MAX_BACKUPS})"
  ls -1t "${BACKUP_DIR}"/backup_*.sql.gz 2>/dev/null | awk "NR>${MAX_BACKUPS}" | xargs -r rm -f
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
