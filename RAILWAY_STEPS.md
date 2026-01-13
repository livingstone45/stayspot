# 📋 RAILWAY STEP-BY-STEP GUIDE

## Your JWT Secret (Save This!)
```
4230d76e4db05330969738731bb72ce28a6467afadc82eeece4fd04f12e8bcf8
```

---

## 🚀 STEP 1: Deploy Backend from GitHub

1. Go to https://railway.app
2. Click the **"New"** button (top right)
3. Select **"GitHub Repo"**
4. Search for **"stayspot"**
5. Click to select it
6. Click **"Deploy Now"**
7. **Wait** for green checkmark ✓ (takes 2-3 minutes)

---

## 🗄️ STEP 2: Create PostgreSQL Database

1. In Railway Dashboard, click **"New"** button again
2. Select **"PostgreSQL"**
3. Railway creates it automatically
4. Click on the **PostgreSQL** service
5. Click **"Variables"** tab
6. **Copy the `DATABASE_URL`** value (looks like `postgresql://...`)
7. **Save it** for next step

---

## 🔐 STEP 3: Add Environment Variables to Backend

1. In Railway Dashboard, click on your **backend service**
2. Click **"Variables"** tab
3. Click **"New Variable"** and add each one:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Paste the value from PostgreSQL step above |
| `JWT_SECRET` | `4230d76e4db05330969738731bb72ce28a6467afadc82eeece4fd04f12e8bcf8` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://livingstone45.github.io` |
| `PORT` | `3000` |

**After adding each variable, press Enter/Save**

4. **Railway auto-redeploys** (watch for green checkmark)
5. **Wait** for deployment to complete

---

## 🌐 STEP 4: Get Your Backend URL

1. In Railway Dashboard, click on your **backend service**
2. Look for **"Public URL"** or **"Deployment URL"** 
3. It looks like: `https://stayspot-production-abc123xyz.up.railway.app`
4. **Copy this URL**
5. **Save it** - you need it for the next step!

---

## ✅ STEP 5: Finalize Deployment (Last Step!)

Once you have your Railway backend URL, run this command:

```bash
cd /home/techhatch/Documents/stayspot

bash railway-finalize.sh https://your-railway-backend-url.up.railway.app
```

**Example:**
```bash
bash railway-finalize.sh https://stayspot-production-abc123xyz.up.railway.app
```

This script will:
- ✅ Update frontend to use your Railway backend
- ✅ Rebuild the frontend
- ✅ Deploy to GitHub Pages
- ✅ Everything goes LIVE!

---

## 🎯 Expected Timeline

| Step | Time | Status |
|------|------|--------|
| Deploy backend | 2-3 min | ⏳ In progress |
| Create PostgreSQL | 1 min | ⏳ Waiting |
| Add variables | 3 min | ⏳ Waiting |
| Auto-redeploy | 2-3 min | ⏳ Waiting |
| Get backend URL | 1 min | ⏳ Waiting |
| Run finalize script | 2 min | ⏳ Waiting |
| **TOTAL** | **~15 min** | 🚀 LIVE! |

---

## 📞 Railway Dashboard Locations

### For GitHub Deployment:
- **Button**: Dashboard → Click **"New"** → **"GitHub Repo"**

### For PostgreSQL:
- **Button**: Dashboard → Click **"New"** → **"PostgreSQL"**

### For Variables:
- **Location**: Service → Click service name → **"Variables"** tab

### For Backend URL:
- **Location**: Service → Click service name → Look for **"Public URL"** or **"Deployment URL"**

### For Logs (if troubleshooting):
- **Location**: Service → Click service name → **"Logs"** tab

---

## ⚠️ Common Issues

### Backend not starting?
- Check **"Logs"** tab in Railway
- Make sure **all variables** are set
- Wait 2-3 minutes (might still be deploying)

### Can't find DATABASE_URL?
- Go to PostgreSQL service
- Click **"Variables"** tab
- Should see `DATABASE_URL` there

### Backend URL looks wrong?
- Make sure you copied the **PUBLIC URL**, not the internal one
- Should start with `https://`

### Script fails with "Backend not responding"?
- This is normal for first deployment
- Wait 30 seconds and run the script again
- Railway might still be starting the backend

---

## 🔗 After Deployment

Your application will be live at:
- **Frontend**: https://livingstone45.github.io/stayspot/
- **Backend**: Your Railway URL from step 4
- **Database**: Railway PostgreSQL (automatically created)

---

## ✨ Next Actions

1. ✅ Copy the JWT secret above
2. ⏳ Go to https://railway.app
3. ⏳ Follow steps 1-4 above
4. ⏳ Copy your backend URL
5. ⏳ Run the finalize script
6. ✅ LIVE!

---

## 🎓 How to Test

After finalize script completes:

1. Go to: https://livingstone45.github.io/stayspot/#/auth/register/tenant
2. Create a new account
3. Your data will be stored in Railway PostgreSQL!
4. You can see it in Railway dashboard

---

**Good luck! 🚀**
