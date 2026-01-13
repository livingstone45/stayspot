# StaySpot Full Stack Deployment - Step by Step

> **Current Status**: Frontend deployed ✅ | Backend ready for deployment 🚀

---

## 🎯 What You're Deploying

- **Frontend**: React app on GitHub Pages (`https://livingstone45.github.io/stayspot/`)
- **Backend**: Node.js API on Vercel (URL varies by deployment)
- **Database**: MySQL on PlanetScale (free tier)

---

## 📋 Prerequisites

Before starting, you need:

1. **GitHub Account** - Already have ✅
2. **Vercel Account** - Free, link to GitHub
3. **PlanetScale Account** - Free MySQL database
4. **Vercel CLI** - Already installed locally ✅

---

## 🔧 Phase 1: Set Up Database (PlanetScale)

**Time: ~5 minutes**

### 1.1 Create PlanetScale Account

1. Go to https://planetscale.com
2. Sign up with GitHub
3. Click "New Database"
4. Name: `stayspot`
5. Region: Pick closest to you
6. Create

### 1.2 Get Connection Details

1. Click your database
2. Click "Connect" button
3. Choose "Node.js"
4. Copy the connection string
5. It looks like: `mysql://username:password@host/stayspot`

**Extract these values:**
```
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_USER=xxxxx
DB_PASSWORD=pscale_pw_xxxxx
DB_NAME=stayspot
```

### 1.3 Test Connection (Optional)

```bash
mysql -h your_host -u your_user -p'your_password' -e "SELECT 1;"
```

If it works, you're ready! If not, double-check credentials.

---

## 🚀 Phase 2: Deploy Backend to Vercel

**Time: ~5 minutes**

### 2.1 Option A: Via GitHub (Recommended - Auto-deploys on push)

1. Go to https://vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Paste: `https://github.com/livingstone45/stayspot`
5. Click "Continue"
6. For "Project Settings":
   - **Root Directory**: `backend`
   - **Framework Preset**: "Other"
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave blank
7. Click "Deploy"

### 2.2 Set Environment Variables on Vercel

During or after deployment:

1. Go to Settings → Environment Variables
2. Add each variable individually:

**Database Variables:**
```
DB_HOST: (from PlanetScale)
DB_USER: (from PlanetScale)
DB_PASSWORD: (from PlanetScale)
DB_NAME: stayspot
DB_PORT: 3306
```

**Application Variables:**
```
JWT_SECRET: KaF+BpVDH0WQpp5WlRHJN5S7WyaQ1ZZB94AtLRmdDS4=
JWT_REFRESH_SECRET: KaF+BpVDH0WQpp5WlRHJN5S7WyaQ1ZZB94AtLRmdDS4=
NODE_ENV: production
FRONTEND_URL: https://livingstone45.github.io
```

3. Click "Save and Deploy"
4. Wait for deployment to complete

### 2.3 Get Your Backend URL

Once deployed:
1. You'll see a URL like: `https://stayspot-backend-<random>.vercel.app`
2. Copy this URL - you'll need it next

### 2.4 Test Backend

In your terminal:
```bash
curl https://your-vercel-url.vercel.app/api/health
```

Should see:
```json
{"status":"Backend is running","timestamp":"2026-01-13T..."}
```

---

## 🎨 Phase 3: Update Frontend

**Time: ~3 minutes**

### 3.1 Update API Endpoint

Edit `frontend/src/services/apiClient.js` (around line 4):

**Find this:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://placeholder-backend.vercel.app/api';
```

**Replace with:**
```javascript
const API_BASE_URL = 'https://your-vercel-url.vercel.app/api';
```

(Use your actual Vercel URL from Phase 2.3)

### 3.2 Create `.env.local` in Frontend

```bash
cd frontend
echo "REACT_APP_API_URL=https://your-vercel-url.vercel.app/api" > .env.local
```

### 3.3 Rebuild Frontend

```bash
npm run build
```

This creates a new optimized build in `frontend/dist/`

### 3.4 Deploy to GitHub Pages

```bash
cd ..
rm -rf docs
cp -r frontend/dist docs
git add docs/
git commit -m "Update backend API endpoint to production Vercel"
git push origin main
```

**Wait 2-3 minutes** for GitHub Pages to update.

---

## ✅ Phase 4: Testing

### 4.1 Test Frontend

1. Go to https://livingstone45.github.io/stayspot/
2. Click "Register as Tenant"
3. Create an account with any email/password
4. Should NOT see the local mock service message
5. Data should save in PlanetScale database

### 4.2 Test Different Roles

Try logging in as:
- **Tenant** (default registration)
- **Manager** - Edit your profile to change role
- **Investor** - Same as above

### 4.3 Verify Database

```bash
mysql -h your_planetscale_host -u your_user -p'your_password' stayspot -e "SELECT * FROM Users LIMIT 1;"
```

Should see users you created.

---

## 🔄 Continuous Deployment

Now that everything is set up:

1. **To update backend**: Push to GitHub → Vercel auto-deploys
2. **To update frontend**: Push to GitHub → GitHub Pages auto-updates (2-3 min delay)
3. **To update database**: Use PlanetScale dashboard or migrations

---

## 🐛 Troubleshooting

### Backend won't deploy on Vercel

**Error: "Connection refused"**
- Check DB_HOST, DB_USER, DB_PASSWORD are correct
- Verify PlanetScale database exists
- Check JWT_SECRET is set

**Error: "Module not found"**
- Run: `npm install` in backend folder
- Commit package-lock.json to GitHub
- Redeploy on Vercel

### Frontend still shows "Network error"

- Clear browser cache: Ctrl+Shift+Delete
- Check `REACT_APP_API_URL` in frontend/.env.local
- Verify backend URL works: `curl https://your-backend-url.vercel.app/api/health`
- Check browser console (F12) for CORS errors

### Database connection timeout

- Check internet connection
- Verify PlanetScale IP whitelist (should be open to all)
- Try: `mysql -h host -u user -p'pass' -e "SELECT 1;"`

---

## 📝 Quick Reference

| Component | Status | URL |
|-----------|--------|-----|
| Frontend | ✅ Deployed | https://livingstone45.github.io/stayspot/ |
| Backend | 🚀 Ready | https://your-vercel-url.vercel.app |
| Database | 🗄️ Ready | PlanetScale (MySQL) |
| API Docs | 📖 See backend/src/routes/ | - |

---

## 🎓 Learn More

- Vercel Docs: https://vercel.com/docs
- PlanetScale Docs: https://planetscale.com/docs
- Express.js: https://expressjs.com
- React Deployment: https://react.dev/learn/deployment

---

## 💡 Tips

1. Keep JWT_SECRET secret! Don't commit to GitHub.
2. Use environment variables for all sensitive data.
3. Test locally before pushing (`npm run dev` in backend).
4. Monitor Vercel dashboard for logs: vercel.com/dashboard
5. PlanetScale has activity logs - check for connection issues there.

---

**Need help?** Check the individual README files:
- `backend/README.md` - Backend setup
- `frontend/README.md` - Frontend setup
- `backend/VERCEL_DEPLOYMENT.md` - Detailed Vercel guide
