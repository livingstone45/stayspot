# StaySpot cPanel Deployment - Simple Checklist

Deploy to **stayspot.co.ke** (Production) and **testly.stayspot.co.ke** (Testing)

---

## 🎯 Quick Overview

```
Your System:
├── stayspot.co.ke           ← Main website (production)
├── testly.stayspot.co.ke    ← Testing website (staging)
├── Database 1                ← Production data
└── Database 2                ← Testing data
```

---

## ✅ Checklist: Step-by-Step

### PHASE 1: Prepare Your Computer (5 min)

- [ ] Open terminal
- [ ] Go to project folder: `cd /home/techhatch/Documents/stayspot`
- [ ] Build everything: `npm run build:backend && npm run build:frontend`
- [ ] Check for errors ✓

### PHASE 2: Create .env Files (5 min)

Create 2 files in the `backend` folder:

**File 1: backend/.env.production**
```
NODE_ENV=production
PORT=8080
BACKEND_URL=https://stayspot.co.ke/api
FRONTEND_URL=https://stayspot.co.ke
CORS_ORIGIN=https://stayspot.co.ke

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_prod
DB_PORT=3306

JWT_SECRET=some-random-secret-key-123
STRIPE_SECRET_KEY=sk_live_xxxx
CLOUDINARY_NAME=your-name
```

**File 2: backend/.env.testing**
```
NODE_ENV=staging
PORT=8081
BACKEND_URL=https://testly.stayspot.co.ke/api
FRONTEND_URL=https://testly.stayspot.co.ke
CORS_ORIGIN=https://testly.stayspot.co.ke

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_test
DB_PORT=3306

JWT_SECRET=some-random-secret-key-456
STRIPE_SECRET_KEY=sk_test_xxxx
CLOUDINARY_NAME=your-name
```

- [ ] Files created ✓

### PHASE 3: cPanel Setup (10 min)

**Login to cPanel → Do these things:**

**Step 1: Add Testing Domain**
- [ ] Go to: **Addon Domains**
- [ ] Add domain: `testly.stayspot.co.ke`
- [ ] Directory: `public_html/testly`
- [ ] Click: **Add Domain**

**Step 2: Create Databases**
- [ ] Go to: **MySQL Databases**
- [ ] Create DB: `username_stayspot_prod`
- [ ] Create DB: `username_stayspot_test`
- [ ] Create users with passwords
- [ ] Assign users to databases
- [ ] ✓ Done

**Step 3: Create Node.js Apps**
- [ ] Go to: **Node.js Selector** (or Setup Node.js App)
- [ ] **App 1 (Production)**:
  - [ ] Domain: `stayspot.co.ke`
  - [ ] Root: `/home/username/public_html/api`
  - [ ] Startup: `src/server.js`
  - [ ] Version: 18.x
  - [ ] Mode: Production
  - [ ] Click: **Create**

- [ ] **App 2 (Testing)**:
  - [ ] Domain: `testly.stayspot.co.ke`
  - [ ] Root: `/home/username/public_html/testly/api`
  - [ ] Startup: `src/server.js`
  - [ ] Version: 18.x
  - [ ] Mode: Production
  - [ ] Click: **Create**

**Step 4: Enable SSL**
- [ ] Go to: **AutoSSL** or **Let's Encrypt**
- [ ] Enable for: `stayspot.co.ke`
- [ ] Enable for: `testly.stayspot.co.ke`
- [ ] Wait 5 minutes for activation

### PHASE 4: Upload Files (10 min)

**From your computer terminal:**

```bash
# Set your cPanel info
USER="your_username"
HOST="your-host.com"

# Upload Production Backend
scp -r backend/dist/* $USER@$HOST:/home/$USER/public_html/api/
scp backend/package.json $USER@$HOST:/home/$USER/public_html/api/
scp backend/package-lock.json $USER@$HOST:/home/$USER/public_html/api/
scp backend/.env.production $USER@$HOST:/home/$USER/public_html/api/.env

# Upload Production Frontend
scp -r frontend/dist/* $USER@$HOST:/home/$USER/public_html/

# Upload Testing Backend
scp -r backend/dist/* $USER@$HOST:/home/$USER/public_html/testly/api/
scp backend/package.json $USER@$HOST:/home/$USER/public_html/testly/api/
scp backend/package-lock.json $USER@$HOST:/home/$USER/public_html/testly/api/
scp backend/.env.testing $USER@$HOST:/home/$USER/public_html/testly/api/.env

# Upload Testing Frontend
scp -r frontend/dist/* $USER@$HOST:/home/$USER/public_html/testly/
```

- [ ] All files uploaded ✓

### PHASE 5: Create .htaccess Files (5 min)

**Via cPanel File Manager → Create these 4 files:**

**File 1: /public_html/.htaccess**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ http://localhost:8080/api/$1 [P,L]
    RewriteRule ^(.*)$ /index.html [QSA,L]
</IfModule>
```

**File 2: /public_html/api/.htaccess**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /api/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:8080/api/$1 [P,L]
</IfModule>
```

**File 3: /public_html/testly/.htaccess**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^api/(.*)$ http://localhost:8081/api/$1 [P,L]
    RewriteRule ^(.*)$ /index.html [QSA,L]
</IfModule>
```

**File 4: /public_html/testly/api/.htaccess**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /api/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:8081/api/$1 [P,L]
</IfModule>
```

- [ ] All .htaccess files created ✓

### PHASE 6: Test Everything (5 min)

**Open your browser and test:**

**Production:**
- [ ] Visit: `https://stayspot.co.ke` → See website?
- [ ] Visit: `https://stayspot.co.ke/api/health` → See JSON response?

**Testing:**
- [ ] Visit: `https://testly.stayspot.co.ke` → See website?
- [ ] Visit: `https://testly.stayspot.co.ke/api/health` → See JSON response?

**All green? ✅ You're done!**

---

## 🆘 Troubleshooting

### Problem: Website shows "Not Found"
**Solution**: Check that frontend files are in `/public_html/` (check cPanel File Manager)

### Problem: API returns 404
**Solution**: 
1. Check Node.js app is running in cPanel (Node.js Selector shows "Running")
2. Verify `.htaccess` files are correct
3. SSH in and check logs: `tail -f ~/public_html/api/error.log`

### Problem: Database won't connect
**Solution**:
1. Check .env file has correct credentials
2. Test in cPanel → MySQL Databases → Check privileges

### Problem: Only production works, testing doesn't
**Solution**: Make sure testing Node.js app is running on port **8081** (not 8080)

---

## 📋 Important: Username/Password Placeholders

Replace these with YOUR actual values:

| Placeholder | What it is | Where to find |
|---|---|---|
| `username` | Your cPanel username | cPanel welcome email |
| `your-host.com` | Your hosting domain | cPanel welcome email |
| `your_db_user` | Database username | cPanel → MySQL Databases |
| `your_db_password` | Database password | You created this |
| `your_db_prod` | Production database name | You created this |
| `your_db_test` | Testing database name | You created this |

---

## ✨ Summary

| What | Production | Testing |
|---|---|---|
| Website URL | stayspot.co.ke | testly.stayspot.co.ke |
| API URL | stayspot.co.ke/api | testly.stayspot.co.ke/api |
| Node Port | 8080 | 8081 |
| Database | _prod | _test |
| Folder | /public_html/ | /public_html/testly/ |

---

## 🚀 How to Update Later

**When you make changes and want to deploy:**

```bash
# Build
npm run build:backend && npm run build:frontend

# Upload only backend
scp -r backend/dist/* $USER@$HOST:/home/$USER/public_html/api/

# Or upload only frontend
scp -r frontend/dist/* $USER@$HOST:/home/$USER/public_html/

# Then restart app in cPanel (or wait a minute)
```

That's it! 🎉
