# cPanel Deployment Guide for StaySpot

This guide covers deploying the StaySpot monorepo (Node.js backend + React frontend) to cPanel hosting.

## Prerequisites

- cPanel account with SSH access enabled
- Node.js support (verify with hosting provider - typically Node 18+)
- Sufficient disk space (at least 2GB for dependencies + build)
- One domain:
  - Main domain for both frontend and backend (e.g., `stayspot.com`)

## Architecture Overview

```
stayspot.com (Single Domain)
├── Frontend - React files served via Apache (/)
│   └── API calls to /api on same domain
└── Backend - Express API running on Node.js (/api)
    ├── MySQL database
    └── Redis cache (if available)
```

## Step 1: Prepare Your Local Build

Before uploading, create optimized builds locally:

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
- `backend/dist/` - Production-ready backend
- `frontend/dist/` - Static frontend files

## Step 2: Set Up Domain in cPanel

1. **Log into cPanel**
2. **Add Main Domain** (if not already added):
   - Go to Addon Domains or Primary Domain
   - Add `stayspot.com`
   - Point to: `/public_html/`
3. **Create API subdirectory**:
   - The backend will run on the same domain under `/api` path

## Step 3: Connect via SSH

```bash
ssh username@your-hosting-domain.com
```

## Step 4: Upload Backend Files

### Option A: Upload via cPanel File Manager
1. Navigate to `public_html/api/`
2. Upload `backend/dist/` contents
3. Upload `backend/package.json` and `backend/package-lock.json`

### Option B: Upload via SCP
```bash
# From your local machine
# Upload backend to api subdirectory
scp -r backend/dist/* username@hosting:/home/username/public_html/api/
scp backend/package.json username@hosting:/home/username/public_html/api/
scp backend/package-lock.json username@hosting:/home/username/public_html/api/
scp backend/.env username@hosting:/home/username/public_html/api/
```

### Option C: Upload via Git
```bash
# On server via SSH
cd ~/public_html
mkdir -p api
cd api
git clone https://your-repo-url.git .
npm install --production
```

## Step 5: Configure Backend Environment

Create `.env` file in `/public_html/api/`:

```bash
# Server
NODE_ENV=production
PORT=8080
BACKEND_URL=https://stayspot.com/api

# Database
DB_HOST=localhost
DB_USER=username_db
DB_PASSWORD=your-db-password
DB_NAME=username_stayspot
DB_PORT=3306

# JWT
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=https://stayspot.com
CORS_ORIGIN=https://stayspot.com
API_PREFIX=/api

# Email
SMTP_HOST=mail.your-domain.com
SMTP_PORT=465
SMTP_USER=your-email@stayspot.com
SMTP_PASSWORD=email-password
SMTP_FROM=noreply@stayspot.com

# Redis (if available)
REDIS_URL=redis://localhost:6379

# Stripe/Payment
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_PUBLIC_KEY=pk_live_your-key

# File Upload
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 6: Create Node.js Application in cPanel

1. **Log into cPanel**
2. **Go to Node.js Selector** (or Setup Node.js App)
3. **Create New Application**:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application URL**: `stayspot.com`
   - **Application root**: `/home/username/public_html/api`
   - **Application startup file**: `src/server.js` (or `dist/server.js`)
   - **Application environment**: Production

4. **Install Dependencies**:
   - Check "Run npm install when deploying"
   - Or SSH in and run: `npm install --production`

## Step 7: Configure Apache Proxy

### Main Domain .htaccess (`/public_html/.htaccess`)

This routes non-API requests to React and API requests to Node.js:

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
```

### API Subdirectory .htaccess (`/public_html/api/.htaccess`)

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Proxy all requests to Node.js
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:8080/api/$1 [P,L]
</IfModule>
```

The cPanel Node.js App Manager will handle proxying automatically when you set the root to `/public_html/api`.

## Step 8: Upload Frontend Files

1. **Build frontend** (if not done already):
```bash
npm run build:frontend
```

2. **Upload to `/public_html/`**:
```bash
scp -r frontend/dist/* username@hosting:/home/username/public_html/
```

3. **Create `.htaccess` for React Router** in `/public_html/`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Skip rewrite for existing files/directories
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Route all requests to index.html for React Router
    RewriteRule ^(.*)$ /index.html [QSA,L]
</IfModule>
```

## Step 9: Set Up Database

1. **Create MySQL Database**:
   - Go to cPanel → MySQL Databases
   - Create new database: `username_stayspot`
   - Create new user with strong password
   - Assign user to database with all privileges

2. **Run Migrations** via SSH:
```bash
cd ~/public_html/api
npm run migrate
npm run seed  # Optional: if you have seed files
```

## Step 10: Configure SSL Certificates

1. Go to cPanel → **AutoSSL** or **Let's Encrypt**
2. Enable automatic SSL for:
   - `stayspot.com`
   - `api.stayspot.com`

Verify with:
```bash
curl -I https://stayspot.com
curl -I https://api.stayspot.com
```

## Step 11: Update Frontend API Configuration

Edit `frontend/src/config/api.js` or `.env`:

```javascript
// For production (same domain)
const API_BASE_URL = '/api';

// For development (localhost)
// const API_BASE_URL = 'http://localhost:3001';
```

Or in `.env.production`:
```
VITE_API_URL=/api
```

Rebuild and redeploy frontend:
```bash
npm run build:frontend
# Upload frontend/dist/* to public_html/
```

## Step 12: Monitor & Maintain

### Check Node.js Application Status
```bash
# SSH into server
ps aux | grep node

# View error logs
tail -f ~/public_html/api/error.log
```

### Restart Application (if needed)
- Via cPanel: Node.js App Manager → Restart
- Via SSH: `pkill -f 'node.*server.js'` then restart via cPanel

### Monitor Logs
```bash
# Application logs
tail -f ~/public_html/api/logs/combined.log

# Error logs
tail -f ~/public_html/api/logs/error.log

# cPanel logs
tail -f /usr/local/apache/logs/error_log
```

## Troubleshooting

### Backend Not Responding (502 Bad Gateway)
```bash
# Check if Node.js is running
ps aux | grep node

# Check port binding
netstat -tlnp | grep 8080

# View Node.js error logs
cd ~/public_html/api
npm start  # Test run to see errors
```

### CORS Errors
- Ensure `CORS_ORIGIN` in `.env` matches frontend domain
- Check browser console for exact error
- Verify headers in backend routes

### Database Connection Failed
```bash
# Test MySQL connection
mysql -h localhost -u username_db -p database_name

# From Node app:
node -e "const conn = require('./dist/config/database'); console.log('Connected')"
```

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080

# Kill if necessary
kill -9 <PID>
```

### Out of Memory Issues
- Increase Node.js memory limit in startup file:
```bash
node --max-old-space-size=512 src/server.js
```

## Performance Optimization

1. **Enable Gzip Compression**:
   - Add to backend (already in helmet/compression middleware)
   - Verify `.htaccess` doesn't conflict

2. **Use Redis for Caching**:
   - If available through hosting provider
   - Configure in `.env`: `REDIS_URL=redis://localhost:6379`

3. **Optimize Images**:
   - Frontend: Already using sharp/image optimization
   - Ensure Cloudinary is configured for image delivery

4. **Enable Browser Caching**:
   - Add to `.htaccess`:
   ```apache
   <IfModule mod_expires.c>
       ExpiresActive On
       ExpiresByType text/css "access plus 1 year"
       ExpiresByType application/javascript "access plus 1 year"
       ExpiresByType image/* "access plus 1 year"
   </IfModule>
   ```

## Backup & Recovery

### Create Regular Backups
```bash
# Backup database
mysqldump -h localhost -u username_db -p username_stayspot > ~/stayspot_backup.sql

# Backup application files
tar -czf ~/stayspot_app_backup.tar.gz ~/public_html/
```

### Restore from Backup
```bash
# Restore database
mysql -h localhost -u username_db -p username_stayspot < ~/stayspot_backup.sql

# Restore application
cd ~
tar -xzf ~/stayspot_app_backup.tar.gz
```

## Deployment Automation Script

Create `/home/techhatch/deploy-to-cpanel.sh`:

```bash
#!/bin/bash

# Configuration
CPANEL_USER="username"
CPANEL_HOST="hosting.domain.com"
REMOTE_PATH="/home/$CPANEL_USER/public_html"

echo "🚀 Building StaySpot..."
npm run build:backend
npm run build:frontend

echo "📦 Uploading backend..."
scp -r backend/dist/* $CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH/api/
scp backend/package.json $CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH/api/
scp backend/.env $CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH/api/

echo "📦 Uploading frontend..."
scp -r frontend/dist/* $CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH/

echo "✅ Deployment complete!"
```

Make executable:
```bash
chmod +x /home/techhatch/deploy-to-cpanel.sh
```

## Production Checklist

- [ ] Node.js version 18+ installed on server
- [ ] Domain `stayspot.com` configured and pointing to `/public_html/`
- [ ] MySQL database created with secure password
- [ ] Environment variables set in `.env` file
- [ ] Backend built and uploaded to `/public_html/api/`
- [ ] Frontend built and uploaded to `/public_html/`
- [ ] `.htaccess` files configured for both root and api directories
- [ ] SSL certificate installed for `stayspot.com` (Let's Encrypt)
- [ ] Database migrations run successfully
- [ ] CORS configured correctly
- [ ] Email/SMTP settings verified
- [ ] Payment gateway keys (Stripe) configured
- [ ] File upload service (Cloudinary) configured
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] DNS records verified
- [ ] Application tested end-to-end
- [ ] Error handling and logging verified
- [ ] Rate limiting enabled
- [ ] Security headers configured (Helmet)

## Support & Documentation

- **Node.js Hosting**: Check cPanel documentation for Node.js support
- **Express API**: https://expressjs.com/
- **React**: https://react.dev/
- **MySQL**: https://dev.mysql.com/doc/
- **Let's Encrypt**: https://letsencrypt.org/

---

**Last Updated**: January 2026
**Version**: 1.0
