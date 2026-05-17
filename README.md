# DNU Postgraduate Education Center (Monorepo)

This repository contains:
- `frontend/` - React + Vite frontend
- `backend/` - Strapi 5 backend (PostgreSQL)
- `backup/` - automated DB backup script

## Run Everything

1. Copy environment template:
   - `cp .env.example .env`
2. Set secure secrets in `.env`.
3. Start all services:
   - `docker compose up --build`

Services:
- Frontend: `http://localhost:3000`
- Strapi API/Admin: `http://localhost:1337` / `http://localhost:1337/admin`
- PostgreSQL: `localhost:5432`

### Localization

- Strapi locales: `uk` (default) and `en`
- Frontend requests locale from `VITE_STRAPI_LOCALE` in `.env` (default `uk`)

## Admin Panel Login

1. Open `http://localhost:1337/admin`
2. Create the first administrator account (on first run).
3. Manage content types and entries from the Strapi admin.

## Manual Backup

Backups are created automatically every 12 hours in `./backups`.

To trigger backup manually:
- `docker compose exec backup /usr/local/bin/backup.sh once`

Backup files are named:
- `backup_YYYY-MM-DD_HH-MM.sql.gz`

Retention policy:
- Keep last 14 backups, older files are deleted automatically.

## Project Structure

```text
/
├── frontend/
├── backend/
├── backup/
│   └── backup.sh
├── backups/
├── docker-compose.yml
├── .env.example
└── README.md
```
