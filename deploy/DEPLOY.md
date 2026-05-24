# Deploy CognitEng Lite **backend API** to `cogniteng.kerek.uz`

API-only deployment. The Next.js frontend is hosted separately (Vercel, Netlify, or
another server) and consumes `https://cogniteng.kerek.uz/api/...`.

Tested on Ubuntu 22.04 / 24.04. Run commands as `root` or with `sudo`.

All deploy artifacts live inside the `backend/` folder:

```
backend/
├── ecosystem.config.js          # PM2 config
├── logs/                        # PM2 log output
└── deploy/
    ├── DEPLOY.md                # this file
    ├── nginx/
    │   └── cogniteng.kerek.uz.conf
    └── env-templates/
        └── backend.env
```

---

## 0. Prerequisites on the server

```bash
# DNS: A record `cogniteng.kerek.uz` → server's public IP, then verify
dig +short cogniteng.kerek.uz

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# MongoDB — follow the official Ubuntu install guide if not yet installed
# https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

# nginx + certbot
apt-get install -y nginx certbot python3-certbot-nginx

# PM2
npm install -g pm2
```

---

## 1. Clone the repo

```bash
cd /var/www
git clone <your-repo-url> cogniteng
cd cogniteng/backend
```

> All remaining commands assume your working directory is `/var/www/cogniteng/backend`.

---

## 2. Install & configure

```bash
npm ci --omit=dev

# Create .env from template
cp deploy/env-templates/backend.env .env
nano .env

# Required edits in .env:
#   - MONGODB_URI password
#   - JWT_ACCESS_SECRET  (generate: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")
#   - JWT_REFRESH_SECRET (different value)
#   - CORS_ORIGIN        (your frontend URL, e.g. https://cogniteng.vercel.app)

# Seed initial content (15 topics, 60 exercises, 15 tests, 2 diagnostics, default teacher)
npm run seed
```

Quick local sanity check (before exposing publicly):
```bash
node src/server.js
# in another shell:
curl -s http://127.0.0.1:5050/api/health
# Ctrl+C the first shell
```

---

## 3. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup     # copy & run the printed `sudo env PATH=... systemctl ...` line ONCE

pm2 status                                # should show "online"
pm2 logs cogniteng-backend --lines 50     # check for errors
```

---

## 4. nginx (HTTP first; certbot adds SSL after)

```bash
# IMPORTANT: copy WITH explicit destination filename (strips the .conf suffix)
# so it matches the symlink name below
cp deploy/nginx/cogniteng.kerek.uz.conf \
   /etc/nginx/sites-available/cogniteng.kerek.uz

ln -s /etc/nginx/sites-available/cogniteng.kerek.uz \
      /etc/nginx/sites-enabled/cogniteng.kerek.uz

# Optional: remove default site to avoid conflicts
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
```

> If you mistakenly copied without renaming (file ended up as
> `/etc/nginx/sites-available/cogniteng.kerek.uz.conf`), fix it with:
> ```bash
> mv /etc/nginx/sites-available/cogniteng.kerek.uz.conf \
>    /etc/nginx/sites-available/cogniteng.kerek.uz
> nginx -t && systemctl reload nginx
> ```

Test:
```bash
curl -s http://cogniteng.kerek.uz/api/health
```

---

## 5. SSL via Let's Encrypt

```bash
# Replace your-email@example.com with a real address
certbot --nginx \
  -d cogniteng.kerek.uz \
  --email your-email@example.com \
  --agree-tos \
  --redirect

# Verify auto-renewal
systemctl status certbot.timer
certbot renew --dry-run
```

`certbot` rewrites `/etc/nginx/sites-available/cogniteng.kerek.uz` to add a `listen 443 ssl`
block and a `301` redirect from port 80 to 443.

---

## 6. Final verification

```bash
# Health check over HTTPS
curl -s https://cogniteng.kerek.uz/api/health | jq

# Default teacher login (created by `npm run seed`)
curl -s -X POST https://cogniteng.kerek.uz/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"teacher@cogniteng.local","password":"teacher123"}' | jq
```

**⚠️ Change the default teacher password immediately.** Either log in through your
frontend and change it, or edit `src/utils/seed.js` before seeding.

---

## 7. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

MongoDB (`27017`) stays closed to the public — it binds to `127.0.0.1` by default.

---

## Frontend hosting (separate)

When you deploy the Next.js frontend somewhere (Vercel is the easy default):

1. Set the frontend's env: `NEXT_PUBLIC_API_URL=https://cogniteng.kerek.uz/api`
2. Run `npm run build` (Next bakes `NEXT_PUBLIC_*` into the bundle)
3. **Add the frontend's URL to `CORS_ORIGIN`** in `backend/.env`, then:
   ```bash
   pm2 restart cogniteng-backend
   ```

Comma-separated multiple origins work, e.g.:
```
CORS_ORIGIN=https://cogniteng.vercel.app,https://staging.cogniteng.vercel.app
```

---

## Updating the backend later

```bash
cd /var/www/cogniteng
git pull

cd backend
npm ci --omit=dev
# (only if models or seed changed) npm run seed
pm2 reload ecosystem.config.js
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `MongoDB connection error: Authentication failed` | Missing `?authSource=admin` in URI, or wrong password | Add it, or recheck with `mongosh "mongodb://root:PASS@127.0.0.1:27017/?authSource=admin"` |
| `EADDRINUSE :5050` | Another process owns the port | `lsof -i :5050` → kill, or change `PORT` |
| `502 Bad Gateway` from nginx | PM2 process not running or crashed | `pm2 status`, `pm2 logs cogniteng-backend` |
| Browser CORS error from your frontend | `CORS_ORIGIN` in `.env` doesn't include your frontend URL | Add it, `pm2 restart cogniteng-backend` |
| Certbot fails with "Connection refused" | Port 80 is blocked by firewall | `ufw allow 80; ufw allow 443` |
| `MongoDB connection error: ... uri ... must be a string` | `.env` uses a different variable name | Code accepts both `MONGODB_URI` and `MONGO_URI` — make sure one is set |
