# StaySpot Dual Domain cPanel Deployment Guide

Deployment for **stayspot.co.ke** (production) and **testly.stayspot.co.ke** (testing)

---

## Architecture Overview

```
stayspot.co.ke (Production)
├── Frontend (React) - /
│   └── API calls to /api
└── Backend (Express) - port 8080, proxied at /api

testly.stayspot.co.ke (Testing/Staging)
├── Frontend (React) - /
│   └── API calls to /api
└── Backend (Express) - port 8081, proxied at /api
```

---

## Prerequisites

- cPanel account with SSH access enabled
- Node.js support (v18+)
- Two domains configured in cPanel:
  - `stayspot.co.ke` (main domain)
  - `testly.stayspot.co.ke` (addon/subdomain)
- Sufficient disk space (2GB+)
- One MySQL database account (both apps can share or use separate DBs)

---

## Phase 1: Local Build Preparation

### Step 1.1: Build Both Versions

```bash
cd /home/techhatch/Documents/stayspot

# Install dependencies
npm install

# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

This creates:
- `backend/dist/` - Backend code
- `frontend/dist/` - Frontend static files

### Step 1.2: Prepare Environment Files

Create two `.env` files:

**backend/.env.production** (for stayspot.co.ke):
```bash
NODE_ENV=production
PORT=8080
BACKEND_URL=https://stayspot.co.ke/api
FRONTEND_URL=https://stayspot.co.ke
CORS_ORIGIN=https://stayspot.co.ke

# Database
DB_HOST=localhost
DB_USER=username_db
DB_PASSWORD=your-db-password
DB_NAME=username_stayspot_prod
DB_PORT=3306

# JWT & Security
JWT_SECRET=your-secure-jwt-secret-key-prod
JWT_EXPIRE=7d

# Email
SMTP_HOST=mail.stayspot.co.ke
SMTP_PORT=465
SMTP_USER=noreply@stayspot.co.ke
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@stayspot.co.ke

# Stripe/Payment
STRIPE_SECRET_KEY=sk_live_your-live-key
STRIPE_PUBLIC_KEY=pk_live_your-live-key

# File Upload
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**backend/.env.testing** (for testly.stayspot.co.ke):
```bash
NODE_ENV=staging
PORT=8081
BACKEND_URL=https://testly.stayspot.co.ke/api
FRONTEND_URL=https://testly.stayspot.co.ke
CORS_ORIGIN=https://testly.stayspot.co.ke

# Database (can be same or separate)
DB_HOST=localhost
DB_USER=username_db
DB_PASSWORD=your-db-password
DB_NAME=username_stayspot_test
DB_PORT=3306

# JWT & Security
JWT_SECRET=your-secure-jwt-secret-key-test
JWT_EXPIRE=7d

# Email
SMTP_HOST=mail.stayspot.co.ke
SMTP_PORT=465
SMTP_USER=noreply@stayspot.co.ke
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@stayspot.co.ke

# Stripe/Payment (use test keys)
STRIPE_SECRET_KEY=sk_test_your-test-key
STRIPE_PUBLIC_KEY=pk_test_your-test-key

# File Upload
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Phase 2: cPanel Configuration

### Step 2.1: Add Domains in cPanel

1. **Log into cPanel**
2. **For stayspot.co.ke (Primary Domain)**:
   - Should already be primary domain
   - Points to: `/home/username/public_html/`

3. **For testly.stayspot.co.ke (Addon Domain)**:
   - Go to: **Addon Domains**
   - Domain: `testly.stayspot.co.ke`
   - Directory: `/home/username/public_html/testly`

### Step 2.2: Create Directory Structure via SSH

```bash
# SSH into cPanel
ssh username@your-hosting.com

# Production directories
mkdir -p ~/public_html/api
mkdir -p ~/public_html/static

# Testing directories
mkdir -p ~/public_html/testly/api
mkdir -p ~/public_html/testly/static
```

---

## Phase 3: Database Setup

### Step 3.1: Create Databases in cPanel

1. Go to **MySQL Databases**
2. **Create Production DB**:
   - Name: `username_stayspot_prod`
   - User: `username_stayspot_prod` (or reuse)
   - Password: `strong-password`
   - Grant all privileges

3. **Create Testing DB**:
   - Name: `username_stayspot_test`
   - User: `username_stayspot_test` (or reuse)
   - Password: `strong-password`
   - Grant all privileges

### Step 3.2: Run Database Migrations

Via SSH:
```bash
# Production
cd ~/public_html/api
npm install --production
npm run migrate
npm run seed  # Optional

# Testing
cd ~/public_html/testly/api
npm install --production
npm run migrate
npm run seed  # Optional
```

---

## Phase 4: Upload Production (stayspot.co.ke)

### Step 4.1: Upload Backend

From your local machine:
```bash
scp -r backend/dist/* username@your-hosting:/home/username/public_html/api/
scp backend/package.json username@your-hosting:/home/username/public_html/api/
scp backend/package-lock.json username@your-hosting:/home/username/public_html/api/
scp backend/.env.production username@your-hosting:/home/username/public_html/api/.env
```

### Step 4.2: Upload Frontend

```bash
scp -r frontend/dist/* username@your-hosting:/home/username/public_html/
```

### Step 4.3: Create .htaccess Files

**Main .htaccess** (`/public_html/.htaccess`):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Skip rewrite for existing files/directories
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # API routes go to Node.js (port 8080)
    RewriteRule ^api/(.*)$ http://localhost:8080/api/$1 [P,L]
    
    # Everything else goes to React index.html
    RewriteRule ^(.*)$ /index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
```

**API .htaccess** (`/public_html/api/.htaccess`):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /api/
    
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:8080/api/$1 [P,L]
</IfModule>
```

---

## Phase 5: Upload Testing (testly.stayspot.co.ke)

### Step 5.1: Upload Backend

```bash
scp -r backend/dist/* username@your-hosting:/home/username/public_html/testly/api/
scp backend/package.json username@your-hosting:/home/username/public_html/testly/api/
scp backend/package-lock.json username@your-hosting:/home/username/public_html/testly/api/
scp backend/.env.testing username@your-hosting:/home/username/public_html/testly/api/.env
```

### Step 5.2: Upload Frontend

```bash
scp -r frontend/dist/* username@your-hosting:/home/username/public_html/testly/
```

### Step 5.3: Create .htaccess Files

**Main .htaccess** (`/public_html/testly/.htaccess`):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # API routes go to Node.js (port 8081 - DIFFERENT PORT!)
    RewriteRule ^api/(.*)$ http://localhost:8081/api/$1 [P,L]
    
    # Everything else goes to React index.html
    RewriteRule ^(.*)$ /index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
```

**API .htaccess** (`/public_html/testly/api/.htaccess`):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /api/
    
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:8081/api/$1 [P,L]
</IfModule>
```

---

## Phase 6: Create Node.js Applications in cPanel

### Step 6.1: Production Node.js App

1. **Log into cPanel**
2. **Go to: Node.js Selector** (or Setup Node.js App)
3. **Create New Application**:
   - **Node.js version**: 18.x (or higher)
   - **Application mode**: Production
   - **Application URL**: `stayspot.co.ke`
   - **Application root**: `/home/username/public_html/api`
   - **Application startup file**: `src/server.js` (check your backend structure)
   - **Application environment**: Production
   - Check: ✅ Run npm install when deploying
   - Click: **Create**

### Step 6.2: Testing Node.js App

1. **Create another Node.js Application**:
   - **Node.js version**: 18.x (or higher)
   - **Application mode**: Production
   - **Application URL**: `testly.stayspot.co.ke`
   - **Application root**: `/home/username/public_html/testly/api`
   - **Application startup file**: `src/server.js`
   - **Application environment**: Staging
   - Check: ✅ Run npm install when deploying
   - Click: **Create**

---

## Phase 7: SSL Certificate Setup

### Step 7.1: AutoSSL in cPanel

1. Go to: **AutoSSL** or **Let's Encrypt**
2. Enable SSL for:
   - ✅ `stayspot.co.ke`
   - ✅ `testly.stayspot.co.ke`

### Step 7.2: Verify SSL

```bash
curl -I https://stayspot.co.ke
curl -I https://testly.stayspot.co.ke
```

---

## Phase 8: Verify Deployment

### Step 8.1: Test Frontend

- Visit: `https://stayspot.co.ke` → Should see React app
- Visit: `https://testly.stayspot.co.ke` → Should see React app

### Step 8.2: Test API

- Visit: `https://stayspot.co.ke/api/health` → Should get API response
- Visit: `https://testly.stayspot.co.ke/api/health` → Should get API response

### Step 8.3: Check Node.js Status

Via SSH:
```bash
# Check production Node.js app status
ps aux | grep "node"

# Check error logs (if configured in cPanel)
tail -f ~/public_html/api/error.log
tail -f ~/public_html/testly/api/error.log
```

---

## Phase 9: Maintenance & Updates

### Redeploying Production

```bash
# Build new version
npm run build:backend && npm run build:frontend

# Upload
scp -r backend/dist/* username@your-hosting:/home/username/public_html/api/
scp -r frontend/dist/* username@your-hosting:/home/username/public_html/

# Restart Node.js app in cPanel (or via SSH)
touch ~/public_html/api/tmp/restart.txt
```

### Redeploying Testing

```bash
# Same as above, but to testing directories
scp -r backend/dist/* username@your-hosting:/home/username/public_html/testly/api/
scp -r frontend/dist/* username@your-hosting:/home/username/public_html/testly/

# Restart
touch ~/public_html/testly/api/tmp/restart.txt
```

### View Logs

```bash
ssh username@your-hosting
tail -f ~/public_html/api/error.log        # Production API
tail -f ~/public_html/testly/api/error.log # Testing API
```

---

## Troubleshooting

### Issue: API not responding (404 on /api/...)

**Solution**:
1. Verify Node.js app is running in cPanel
2. Check `.htaccess` proxy rules (port 8080/8081)
3. Enable mod_proxy and mod_rewrite in cPanel
4. Check backend error logs

### Issue: Frontend routing not working

**Solution**:
1. Verify `.htaccess` in `/public_html/` routes all to `index.html`
2. Clear browser cache
3. Check `RewriteEngine On` is enabled

### Issue: Environment variables not loading

**Solution**:
```bash
ssh username@your-hosting
cd ~/public_html/api
cat .env  # Verify file exists
node -e "require('dotenv').config(); console.log(process.env.DB_HOST)"
```

### Issue: Database connection error

**Solution**:
1. Verify database credentials in `.env`
2. Test from SSH:
```bash
mysql -h localhost -u username_stayspot_prod -p username_stayspot_prod
```

### Issue: Port conflicts (both apps fighting for same port)

**Solution**: This is already handled! We use:
- **Port 8080** for production (stayspot.co.ke)
- **Port 8081** for testing (testly.stayspot.co.ke)
- Each domain's `.htaccess` routes to correct port

---

## Quick Reference: Command Cheat Sheet

```bash
# SSH into server
ssh username@your-hosting

# Check Node processes
ps aux | grep node

# View production API logs
tail -f ~/public_html/api/error.log

# View testing API logs
tail -f ~/public_html/testly/api/error.log

# Restart production app
touch ~/public_html/api/tmp/restart.txt

# Restart testing app
touch ~/public_html/testly/api/tmp/restart.txt

# Check disk space
du -sh ~/public_html

# Check Node.js version
node --version

# Test API endpoint
curl -I https://stayspot.co.ke/api/health
curl -I https://testly.stayspot.co.ke/api/health
```

---

## Security Checklist

- ✅ Use HTTPS for both domains (SSL/TLS)
- ✅ Store `.env` files outside web root (or restrict access)
- ✅ Set strong database passwords
- ✅ Enable mod_proxy restrictions (cPanel settings)
- ✅ Regular backups of databases and files
- ✅ Monitor error logs for suspicious activity
- ✅ Keep Node.js and npm updated
- ✅ Use environment-specific JWT secrets

---

## Summary

| Item | Production | Testing |
|------|------------|---------|
| Domain | stayspot.co.ke | testly.stayspot.co.ke |
| Root | /public_html/ | /public_html/testly/ |
| API Path | /public_html/api | /public_html/testly/api |
| Node Port | 8080 | 8081 |
| Database | username_stayspot_prod | username_stayspot_test |
| Frontend URL | https://stayspot.co.ke | https://testly.stayspot.co.ke |
| API URL | https://stayspot.co.ke/api | https://testly.stayspot.co.ke/api |

---

**Last Updated**: January 12, 2026
**Version**: 1.0
