# ЦНО ДНУ — Centre for Professional Development (Monorepo)

Stack: React + Vite (nginx) | Strapi 5 (PostgreSQL) | Docker Compose

---

## One-command launch

```bash
cp .env.example .env
# Edit .env — fill in secrets and SUPERADMIN_EMAIL/SUPERADMIN_PASSWORD
docker compose up --build
```

### Access points

| Service | Local dev | University server |
|---|---|---|
| Website | http://localhost:3000 | http://SERVER |
| Strapi admin | http://localhost:1337/admin | http://SERVER:1337/admin |
| PostgreSQL | localhost:5432 | — (internal) |

> For local dev on a Mac where port 80 requires root, add `FRONTEND_PORT=3000` to `.env`.

---

## First-launch superadmin

On the **very first boot** (empty database), the backend auto-provisions a Strapi admin user from env vars:

```env
SUPERADMIN_EMAIL=admin@365.dnu.edu.ua
SUPERADMIN_PASSWORD=your_strong_admin_password
```

After first boot you can log into `http://SERVER:1337/admin` with those credentials — no manual setup required.

---

## Frontend admin dashboard auth

The frontend `/admin` dashboard is **separate** from the Strapi admin panel (`/admin` on port 1337).

Flow:
1. Strapi superadmin creates a **User** (not an "Administrator") in Strapi admin → Content Manager → Users.
2. That User logs into the frontend dashboard via `POST /api/auth/local` with their email + password.
3. Public self-registration is **disabled** — only the Strapi admin can create Users.

---

## Content editing

All page content (text, headings, components, lists) is managed from the Strapi admin:
- `http://SERVER:1337/admin` → Content Manager → pick any single type or collection.
- Click **Save** — changes are **instantly live** (Draft & Publish is disabled on all content types).
- Edits persist across container restarts (the seed only runs once on a fresh database).

### Re-seeding

To reset all content back to seed defaults (e.g. after a wipe):

```bash
docker compose down -v          # wipe DB volume
docker compose up --build       # fresh seed runs automatically
```

To force re-seed without wiping (adds SEED_FORCE=true temporarily):
```bash
SEED_FORCE=true docker compose up --build
```

To disable seeding entirely: add `SEED_ON_FIRST_RUN=false` to `.env`.

---

## Localization

- Strapi locales: `uk` (default) and `en`.
- Admin content in Ukrainian is the primary locale. English is a secondary translation.
- The frontend language toggle switches the request locale (`?locale=uk` or `?locale=en`).

---

## Email notifications

Configure SMTP in `.env` to enable notifications when applications are submitted:

```env
SMTP_HOST=smtp.office365.com   # or smtp.gmail.com / sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your-address@365.dnu.edu.ua
SMTP_PASS=your-password
SMTP_FROM=your-address@365.dnu.edu.ua
ADMIN_NOTIFY_EMAIL=info@365.dnu.edu.ua
```

Leave `SMTP_USER` / `SMTP_PASS` empty to disable email silently (applications are still saved).

The notification is sent **fire-and-forget** — form submissions never wait on the mail server, so a slow or misconfigured SMTP never blocks the user (failures are logged, the application is always saved).

> **Office 365 note:** Microsoft disables `SmtpClientAuthentication` (basic SMTP auth) for most tenants by default. If you see `535 5.7.139 ... SmtpClientAuthentication is disabled for the Tenant`, a Microsoft 365 admin must enable SMTP AUTH for the mailbox (Microsoft 365 admin center → Active users → mailbox → Mail → Manage email apps → Authenticated SMTP), or use a different provider for testing (Gmail app-password or Mailtrap).

---

## File uploads (application documents)

Applicants can upload diploma, passport, IPN, and photo scans in the Apply form.
Files are stored in `backend/public/uploads/` (mounted as a Docker volume).
View uploaded documents in Strapi admin → Applications → any entry.

---

## Backups & restore

The `backup` service automatically saves a snapshot **every 12 hours** to `./backups/`
(on the host, so they survive `docker compose down -v`). The last **14** are kept; older
ones are deleted automatically. Each snapshot is a matching pair:

- `backup_YYYY-MM-DD_HH-MM.sql.gz` — the database (Postgres dump)
- `uploads_YYYY-MM-DD_HH-MM.tar.gz` — the uploaded files (diplomas, photos, etc.)

### Make a backup right now

```bash
docker compose exec backup /usr/local/bin/backup.sh once
```

### List available backups

```bash
./backup/restore.sh
```

```
  backup_2026-06-07_23-21.sql.gz   1.2M  + files
  backup_2026-06-07_11-21.sql.gz   1.2M  + files
  ...
```

### Restore a specific backup

```bash
./backup/restore.sh backup_2026-06-07_23-21.sql.gz   # a specific one
./backup/restore.sh latest                           # the newest one
./backup/restore.sh latest -y                        # skip the confirmation prompt
```

The restore is safe by design:

1. A **safety backup** of the current state is saved first (so a wrong restore is undoable).
2. The backend is stopped, the database is recreated and loaded from the chosen dump.
3. The matching uploaded files are restored (if that backup includes them).
4. The backend is started again.

If something looks wrong afterwards, the command prints the exact safety-backup file to
restore in order to roll back. Run everything **from the project root on the server.**

---

## Project structure

```
/
├── frontend/          React + Vite app (nginx container)
├── backend/           Strapi 5 (node container)
├── backup/            backup.sh
├── backups/           DB dump files
├── docker-compose.yml
├── .env.example
└── README.md
```
