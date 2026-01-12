# Quick cPanel Deployment Checklist

## Pre-Deployment Setup

### 1. Hosting Provider Configuration
- [ ] cPanel account created
- [ ] SSH access enabled
- [ ] Node.js support enabled (version 18+)
- [ ] One domain available:
  - [ ] `stayspot.com` (Frontend + Backend API)

### 2. Local Preparation
- [ ] Clone/have access to StaySpot repository
- [ ] Node.js 18+ and npm installed locally
- [ ] All dependencies installed: `npm install`
- [ ] Backend builds successfully: `npm run build:backend`
- [ ] Frontend builds successfully: `npm run build:frontend`
- [ ] `.env.production` created with all necessary variables

## Deployment Steps

### Step 1: Database Setup (First Time Only)
**Time: 5-10 minutes**

- [ ] SSH into cPanel server
- [ ] Create MySQL database via cPanel:
  - [ ] Database name: `username_stayspot`
  - [ ] Database user with strong password
  - [ ] User has all privileges
- [ ] Note database credentials

**Commands:**
```bash
ssh username@your-hosting.com
mysql -h localhost -u db_user -p
# Inside MySQL:
# CREATE DATABASE username_stayspot;
# CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'strong_password';
# GRANT ALL PRIVILEGES ON username_stayspot.* TO 'db_user'@'localhost';
# FLUSH PRIVILEGES;
```

### Step 2: Domain Configuration
**Time: 5 minutes**

- [ ] Primary domain: `stayspot.com` → `/public_html/`
- [ ] Create `/public_html/api/` subdirectory for backend
- [ ] Verify DNS propagation (may take 24 hours)

### Step 3: Deploy Backend
**Time: 10-15 minutes**

```bash
# From your local machine, run the deployment script:
chmod +x deploy-cpanel.sh
./deploy-cpanel.sh username hosting.com
```

Or manually:
```bash
# Build
npm run build:backend

# Upload
scp -r backend/dist/* username@hosting.com:/home/username/public_html/api/
scp backend/package.json username@hosting.com:/home/username/public_html/api/
scp backend/package-lock.json username@hosting.com:/home/username/public_html/api/
```

- [ ] Backend files uploaded to `/public_html/api/`
- [ ] SSH into server and run: `cd /home/username/public_html/api && npm install --production`
- [ ] Create `.env` file in `/public_html/api/` with production values
- [ ] Run migrations: `npm run migrate`
- [ ] Run seeds (if applicable): `npm run seed`

### Step 4: Configure Backend in cPanel
**Time: 5 minutes**

- [ ] Go to cPanel → Node.js Selector
- [ ] Create New Application:
  - [ ] Node.js version: 18.x
  - [ ] Application mode: Production
  - [ ] Application URL: `stayspot.com`
  - [ ] Application root: `/home/username/public_html/api`
  - [ ] Application startup file: `src/server.js` or `dist/server.js`
- [ ] Check "Run npm install when deploying"
- [ ] Click Deploy

### Step 5: Deploy Frontend
**Time: 5-10 minutes**

```bash
# Build
npm run build:frontend

# Upload
scp -r frontend/dist/* username@hosting.com:/home/username/public_html/
```

- [ ] Frontend files uploaded to `/public_html/`
- [ ] Verify `.htaccess` for React Router is in place

### Step 6: SSL Certificate
**Time: 5 minutes**

- [ ] Go to cPanel → AutoSSL or Let's Encrypt
- [ ] Enable SSL for `stayspot.com`
- [ ] Wait for certificate to install (usually instant)

### Step 7: Configure Environment Variables
**Time: 5 minutes**

SSH and create `.env` file:
```bash
ssh username@hosting.com
nano /home/username/public_html/api/.env
```

Add these variables:
```
NODE_ENV=production
PORT=8080
BACKEND_URL=https://stayspot.com/api
DB_HOST=localhost
DB_USER=db_user
DB_PASSWORD=your-password
DB_NAME=username_stayspot
JWT_SECRET=your-long-secure-secret
FRONTEND_URL=https://stayspot.com
CORS_ORIGIN=https://stayspot.com
API_PREFIX=/api
```

### Step 8: Verify Deployment
**Time: 10 minutes**

```bash
# Test backend health check
curl https://stayspot.com/api/health

# Test frontend loads
curl https://stayspot.com
```

Check browser:
- [ ] Navigate to `https://stayspot.com` - frontend loads
- [ ] Check browser console for errors
- [ ] Check Network tab - API calls to `/api/...` successful
- [ ] Test login functionality
- [ ] Test core features (create property, etc.)

## Post-Deployment

### Monitoring
- [ ] Set up error logging
- [ ] Monitor application logs: `tail -f ~/public_html/api/logs/error.log`
- [ ] Monitor Node.js process: `ps aux | grep node`
- [ ] Check system resources via cPanel

### Backup
- [ ] Create backup of database: `mysqldump -u db_user -p username_stayspot > backup.sql`
- [ ] Create backup of files: `tar -czf backup.tar.gz ~/public_html/`
- [ ] Download backups to local machine
- [ ] Test restore procedure

### Security
- [ ] Enable firewall
- [ ] Set file permissions correctly (644 for files, 755 for directories)
- [ ] Disable directory listing in `.htaccess`
- [ ] Remove sensitive files from web root
- [ ] Enable rate limiting (already in backend)
- [ ] Verify CORS is restrictive

### Performance
- [ ] Enable Gzip compression
- [ ] Enable browser caching
- [ ] Test with browser DevTools (lighthouse)
- [ ] Check response times

## Troubleshooting

### Backend not responding (502 error)
```bash
# SSH and check
ps aux | grep node
# Check port 8080
netstat -tlnp | grep 8080
# Restart via cPanel Node.js App Manager
# Or: pkill -f 'node.*server.js'
```

### Database connection failed
```bash
# Test connection
mysql -h localhost -u db_user -p -e "SELECT 1 FROM information_schema.schemata;"
# Check .env credentials
```

### CORS errors
- Verify `CORS_ORIGIN` in `.env` matches frontend domain
- Check browser console for exact error
- Test with: `curl -H "Origin: https://stayspot.com" https://api.stayspot.com/api/health`

### Frontend shows 404s
- Verify `.htaccess` is in `/public_html/`
- Check rewrite mod is enabled: `a2enmod rewrite`
- Test with: `curl https://stayspot.com/health`

### Out of memory
- Increase Node.js memory in startup: `node --max-old-space-size=512`
- Check running processes: `ps aux | head -n 20`

## Environment Variables Reference

```
# Server Configuration
NODE_ENV=production
PORT=8080
BACKEND_URL=https://stayspot.com/api

# Database
DB_HOST=localhost
DB_USER=username_db
DB_PASSWORD=strong-password
DB_NAME=username_stayspot
DB_PORT=3306

# Authentication
JWT_SECRET=your-super-secret-key-here-min-32-chars
JWT_EXPIRE=7d

# CORS & Frontend
FRONTEND_URL=https://stayspot.com
CORS_ORIGIN=https://stayspot.com
API_PREFIX=/api

# Email
SMTP_HOST=mail.your-domain.com
SMTP_PORT=465
SMTP_USER=noreply@stayspot.com
SMTP_PASSWORD=email-password
SMTP_FROM=noreply@stayspot.com

# File Upload (Cloudinary)
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_live_your-key
STRIPE_PUBLIC_KEY=pk_live_your-key

# Cache (Optional)
REDIS_URL=redis://localhost:6379
```

## Success Indicators

✅ All items below should work:

- [ ] Frontend loads without errors: `https://stayspot.com`
- [ ] API responds to requests: `https://stayspot.com/api/health`
- [ ] Login works and sets JWT token
- [ ] Database queries work (check after login)
- [ ] File uploads work
- [ ] Email notifications send
- [ ] Browser console has no CORS errors
- [ ] Network tab shows successful API calls (200, 201 status codes)
- [ ] SSL certificates valid (green lock in browser)
- [ ] No 5xx errors in logs
- [ ] API calls use `/api` path prefix

---

**Estimated Total Deployment Time**: 45-60 minutes (first time)
**Re-deployment Time**: 10-15 minutes (updates only)
**Single Domain Setup**: Simplified - no subdomain configuration needed

For detailed instructions, see `CPANEL_DEPLOYMENT_GUIDE.md`
