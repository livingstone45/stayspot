# Deploy StaySpot Backend & Database to Railway

Railway is a free platform that hosts your backend API and PostgreSQL database. Perfect for your GitHub Pages frontend!

## 📋 Quick Setup (10 minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Start New Project"
3. Sign in with GitHub (recommended)

### Step 2: Create PostgreSQL Database
1. In Railway dashboard, click "New"
2. Select "PostgreSQL"
3. Railway creates a free database automatically
4. You'll get `DATABASE_URL` - **copy this!**

### Step 3: Deploy Backend from GitHub
1. In Railway, click "New" → "GitHub Repo"
2. Select `stayspot` repository
3. Railway auto-detects it's a Node.js project
4. Click "Deploy"

### Step 4: Configure Environment Variables
In Railway dashboard → your backend service → "Variables":

```
DATABASE_URL=<paste from step 2>
JWT_SECRET=generate-a-random-secret-string-here
NODE_ENV=production
FRONTEND_URL=https://livingstone45.github.io
PORT=3000
```

To generate JWT_SECRET, run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Get Your Backend URL
In Railway dashboard, go to your backend service:
- You'll see a public URL like: `https://stayspot-production-abc123.up.railway.app`
- **Copy this URL!**

### Step 6: Connect to Frontend

Update your frontend to use this backend:

**File: `frontend/src/services/apiClient.js` (around line 4)**

```javascript
// Change this:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// To this:
const API_BASE_URL = 'https://your-railway-backend-url.up.railway.app/api';
```

### Step 7: Rebuild & Deploy Frontend

```bash
cd frontend
npm run build
cd ..
rm -rf docs && cp frontend/dist docs
git add -A
git commit -m "Connect frontend to Railway backend"
git push origin main
```

Frontend updates live at: https://livingstone45.github.io/stayspot

---

## ✅ Test It Works

### 1. Register New User
- Go to: https://livingstone45.github.io/stayspot/#/auth/register/tenant
- Enter email and password
- Click "Sign up"
- Should redirect to tenant dashboard

### 2. Check Backend Logs
In Railway dashboard → your service → "Logs":
- Should see registration request logged
- No errors should appear

### 3. Check Database
In Railway dashboard → PostgreSQL → "Data" tab:
- Should see your new user in the `users` table

---

## 🔄 How It Works

```
Your Computer
    ↓ (You visit GitHub Pages)
GitHub Pages (Static Frontend)
    ↓ (Frontend makes API calls)
Railway Backend (Node.js)
    ↓ (Backend queries)
Railway PostgreSQL Database
```

**All communication is HTTPS** → completely secure!

---

## 📱 Features Now Working

✅ User Registration (stored in database)
✅ User Login (JWT tokens)
✅ Tenant Dashboard
✅ Property Management
✅ All API endpoints

---

## 🚨 Common Issues

### "Cannot GET /api/health"
- Backend might be sleeping (free tier)
- Visit https://your-railway-backend-url.up.railway.app once to wake it up
- Wait 30 seconds and try again

### "Connection refused to database"
- Check DATABASE_URL is correct in Railway variables
- Make sure JWT_SECRET is set
- Restart service: Railway dashboard → service → "Redeploy"

### "CORS error from frontend"
- Check FRONTEND_URL in backend variables
- Should be: `https://livingstone45.github.io`
- Restart backend service

### "User registration fails silently"
- Check backend logs in Railway
- Verify API endpoint is correct in frontend
- Make sure backend is running (check Railway status)

---

## 📊 Monitoring

Railway gives you free:
- ✅ Real-time logs
- ✅ Performance metrics
- ✅ Error tracking
- ✅ Database browser
- ✅ 500 hours/month free credits

---

## 🔐 Security Notes

- Keep `JWT_SECRET` secret (Railway handles this for you)
- Database password is secure (Railway manages it)
- All traffic is HTTPS encrypted
- Frontend on GitHub Pages is static (safe)

---

## 💾 Database Schema

Your schema (1671 lines) with 50+ tables is automatically supported:
- Users, Roles, Permissions
- Properties, Tenants, Leases
- Maintenance, Financial, Tasks
- Communications, Security logs
- And more...

Railway PostgreSQL handles everything!

---

## 🎯 Next Steps

1. ✅ Create Railway account
2. ✅ Create PostgreSQL database
3. ✅ Deploy backend
4. ✅ Get backend URL
5. ✅ Update frontend
6. ✅ Test registration/login
7. ✅ View data in Railway database

**Total time: 10-15 minutes**

---

## 📞 Support

- Railway docs: https://docs.railway.app
- Backend API: `/api/health` endpoint returns status
- Check logs anytime in Railway dashboard

---

**Ready? Let's go!** 🚀
