# 🚀 Full Stack Automatic Deployment Guide

Deploy **Frontend + Backend + Database** automatically to GitHub!

---

## 🎯 What Gets Deployed Automatically

✅ **Frontend** → GitHub Pages (stayspot.co.ke)
✅ **Backend** → GitHub Releases (ready to deploy anywhere)
✅ **Database** → Backed up in GitHub (schema + data)
✅ **Migrations** → Run automatically on every deploy

---

## 📋 Architecture

```
Your Code Push to GitHub
        ↓
GitHub Actions Workflow Triggers
        ↓
┌─────────────────────────────────────┐
│  1. Setup MySQL Database            │
│  2. Import Database Schema          │
│  3. Run Migrations                  │
│  4. Build Backend                   │
│  5. Build Frontend                  │
│  6. Deploy Frontend to Pages        │
│  7. Deploy Backend to Releases      │
│  8. Backup Database                 │
└─────────────────────────────────────┘
        ↓
✅ Everything is Live & Public
```

---

## 🔧 Setup Steps

### Step 1: Create GitHub Repository

```bash
# If you haven't already
cd /home/techhatch/Documents/stayspot

# Initialize git
git init
git remote add origin https://github.com/YOUR_USERNAME/stayspot.git
git branch -M main
```

### Step 2: Ensure Workflows Are in Place

The workflows are already created:
- `.github/workflows/full-stack-deploy.yml` ← Main deployment
- `.github/workflows/deploy.yml` ← Frontend only (optional)

### Step 3: Push to GitHub

```bash
git add .
git commit -m "Full stack deployment setup"
git push -u origin main
```

### Step 4: GitHub Actions Will Run Automatically

1. Go to: `https://github.com/YOUR_USERNAME/stayspot/actions`
2. Watch the workflow execute
3. All 8 steps complete automatically

---

## 📦 What Gets Deployed Where

### Frontend (GitHub Pages)
- **Location**: `frontend/dist/`
- **URL**: `https://stayspot.co.ke` (or GitHub Pages URL)
- **Access**: Public ✅
- **Updates**: Every push

### Backend (GitHub Releases)
- **Location**: `backend/dist/`
- **URL**: GitHub Releases tab
- **Access**: Public ✅
- **Format**: Downloadable package ready to deploy

### Database (GitHub Artifacts)
- **Location**: `database/schemas/stayspot_schema.sql`
- **Backup**: Every workflow run
- **Retention**: 30 days
- **Access**: Private (GitHub Actions artifacts)

---

## 🌐 Accessing Your Deployed Website

### Frontend (Immediately Available)
```
https://stayspot.co.ke
or
https://YOUR_USERNAME.github.io/stayspot
```

### Backend (For Local Testing)
1. Download from GitHub Releases
2. Extract backend files
3. Run with: `npm start`

### Database (To Use)
1. Go to GitHub Actions artifacts
2. Download `database-backup`
3. Import: `mysql < stayspot_schema.sql`

---

## 🔄 Making Updates

After making code changes:

```bash
# 1. Make your changes...

# 2. Stage and commit
git add .
git commit -m "Your change description"

# 3. Push to GitHub
git push origin main

# 4. Watch automatic deployment
# Go to: Actions tab
# Deployment happens in ~3-5 minutes ✅
```

**That's it!** Everything deploys automatically!

---

## 📊 Workflow Details

### Database Setup (Step 1-3)

```sql
-- Automatically runs on every deployment
CREATE DATABASE IF NOT EXISTS stayspot_db;
-- All tables created
-- All migrations run
-- Data initialized
```

### Build Process (Step 4-5)

```bash
npm run build:backend
npm run build:frontend
```

### Deployment (Step 6-8)

```
Frontend → GitHub Pages (public URL)
Backend → GitHub Releases (downloadable)
Database → GitHub Artifacts (backup)
```

---

## 🔐 Security Considerations

### What's Public ✅
- Frontend code & assets
- Backend code (in releases)
- Database schema
- Documentation

### What's Private ⚠️
- `.env` files (in .gitignore)
- API keys & secrets
- Real database data
- Credentials

---

## 📈 Deployment History

Every deployment is tracked:

1. **Releases Tab**: All backend versions
2. **Actions Tab**: Deployment logs
3. **Artifacts**: Database backups
4. **Pages**: Frontend versions

---

## ✅ Verification Checklist

After first deployment:

- [ ] Frontend accessible at public URL
- [ ] GitHub Pages enabled
- [ ] Backend in Releases tab
- [ ] Database schema backed up
- [ ] Actions workflow showing ✅

---

## 🆘 Troubleshooting

### Workflow Fails
1. Check Actions tab for error logs
2. Verify `npm run build:backend` works locally
3. Ensure all dependencies in package.json
4. Check database schema is valid

### Frontend Not Updating
1. Clear browser cache
2. Check if workflow completed successfully
3. Wait 2-5 minutes for Pages to update
4. Verify custom domain CNAME if using one

### Database Error
1. Check schema file is in `database/schemas/`
2. Verify MySQL syntax (no errors in schema)
3. Check .gitignore includes `.env` files
4. Ensure no secrets in SQL files

---

## 📝 Environment Variables

Create `.env` files for local development:

**backend/.env.production**
```
NODE_ENV=production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=stayspot_db
DB_PORT=3306
PORT=8080
BACKEND_URL=https://stayspot.co.ke/api
FRONTEND_URL=https://stayspot.co.ke
```

**Note**: `.env` files are in `.gitignore` and won't be committed!

---

## 🎯 Full Deployment Timeline

```
Push Code → 5 seconds
  ↓
Workflow Starts → 10 seconds
  ↓
Dependencies Install → 30 seconds
  ↓
Database Setup → 20 seconds
  ↓
Build Backend → 45 seconds
  ↓
Build Frontend → 60 seconds
  ↓
Deploy to Pages → 20 seconds
  ↓
Deploy to Releases → 15 seconds
  ↓
Done! ✅ (Total ~3 minutes)
```

---

## 💡 Pro Tips

1. **Test locally first**:
   ```bash
   npm run build:backend && npm run build:frontend
   ```

2. **Use meaningful commit messages**:
   ```bash
   git commit -m "feature: Add property management dashboard"
   ```

3. **Monitor deployments**:
   - Check Actions tab regularly
   - Watch for failed workflows
   - Review release notes

4. **Backup important data**:
   - Download database artifacts
   - Keep local copies of releases
   - Document schema changes

---

## 🚀 Next Steps

1. ✅ Push code to GitHub
2. ✅ Watch first deployment
3. ✅ Access your live website
4. ✅ Make changes & push again
5. ✅ Automatic deployment happens!

---

## 📞 Support

For issues or questions:
1. Check Actions tab for error details
2. Review workflow logs
3. Verify local builds work
4. Check .gitignore for sensitive files

---

**Your website is now:**
- 🌐 Public & accessible worldwide
- 🤖 Automatically deploying on every push
- 💾 Database backed up automatically
- 🔒 Secure with HTTPS
- 📈 Fully versioned in GitHub

**Happy deploying! 🎉**

---

**Last Updated**: January 12, 2026
**Status**: Fully Automated ✅
