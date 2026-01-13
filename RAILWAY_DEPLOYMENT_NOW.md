# 🚀 RAILWAY DEPLOYMENT - YOUR SETUP

## ⚡ Quick Summary
Your backend is ready to deploy to Railway. Follow these exact steps:

---

## 📝 STEP 1: Go to Railway Dashboard

1. Open: **https://railway.app**
2. Click **"New Project"** (top right)
3. Select **"Deploy from GitHub"**

---

## 🔗 STEP 2: Connect Your GitHub Repository

1. Search for: **stayspot**
2. Select: **livingstone45/stayspot**
3. Click **"Deploy"**
4. ⏳ Wait 2-3 minutes for deployment to complete
5. ✅ You'll see a green checkmark when done

---

## 🗄️ STEP 3: Add PostgreSQL Database

1. In Railway Dashboard, click **"New"**
2. Select **"PostgreSQL"**
3. Click **"Create"**
4. ⏳ Wait for PostgreSQL to start
5. Click on the **PostgreSQL** service
6. Go to **"Connect"** tab
7. **Copy the connection string** that looks like:
   ```
   postgresql://username:password@host:port/railway
   ```

---

## 🔐 STEP 4: Add Environment Variables to Backend

1. Click on your **Backend Service** (the one named "stayspot" or similar)
2. Click **"Variables"** tab
3. Click **"Add Variable"** and fill in these values:

### Variables to Add:

**Variable 1:**
```
Name: DATABASE_URL
Value: [Paste the PostgreSQL connection string from STEP 3]
```
Then click **Add**

**Variable 2:**
```
Name: JWT_SECRET
Value: 4230d76e4db05330969738731bb72ce28a6467afadc82eeece4fd04f12e8bcf8
```
Then click **Add**

**Variable 3:**
```
Name: NODE_ENV
Value: production
```
Then click **Add**

**Variable 4:**
```
Name: FRONTEND_URL
Value: https://livingstone45.github.io/stayspot
```
Then click **Add**

**Variable 5:**
```
Name: PORT
Value: 3000
```
Then click **Add**

---

## ✅ STEP 5: Verify Deployment

1. Check the Backend service status - should show **green checkmark**
2. Click the Backend service
3. Go to **"Deployments"** tab
4. Look for a green checkmark ✅
5. Click **"View Logs"** to see if everything is working

---

## 🎯 STEP 6: Get Your Backend URL

1. Click on Backend service
2. Go to **"Settings"** tab
3. Look for **"Domains"** section
4. You'll see a URL like: `https://stayspot-production-xxxx.railway.app`
5. **Copy this URL** - this is your live API!

---

## 🔗 STEP 7: Update Frontend with Backend URL

After you have the Railway backend URL:

1. Open file: `frontend/src/services/apiClient.js`
2. Find the line with `VITE_API_URL`
3. Update it to: `https://your-railway-url` (from STEP 6)
4. Commit and push to GitHub
5. Frontend auto-updates (GitHub Pages redeploys)

---

## ✨ Your Information

### JWT Secret (Already Generated)
```
4230d76e4db05330969738731bb72ce28a6467afadc82eeece4fd04f12e8bcf8
```

### Frontend URL
```
https://livingstone45.github.io/stayspot/
```

### Database
- Type: PostgreSQL (auto-created by Railway)
- Connection: Via DATABASE_URL variable
- Schema: Already configured (50+ tables)

---

## 🧪 Test After Deployment

Once deployed:

1. Open your Railway backend URL in browser
2. Should see API response (not blank page)
3. Test login with: `tenant@example.com` / `password123`
4. Check if data persists

---

## 💾 What Gets Deployed

✅ Backend code (Node.js/Express)
✅ Database schema (50+ tables)
✅ API routes (30+ endpoints)
✅ Environment variables
✅ JWT authentication
✅ CORS configuration

---

## 📞 Common Issues

**Issue: Deployment fails**
- Check GitHub connection is authorized
- Verify package.json exists
- Check syntax in environment variables

**Issue: PostgreSQL won't connect**
- Verify DATABASE_URL is correct
- Copy entire connection string including port
- Make sure no extra spaces

**Issue: Backend gives 404**
- Wait 1-2 minutes for full deployment
- Clear cache and refresh
- Check "View Logs" for errors

---

## ✅ Next Steps After Deployment

1. Note your Railway backend URL
2. Update `frontend/src/services/apiClient.js`
3. Test login from frontend
4. Verify data persists
5. Create test report
6. Go live! 🎉

---

**Est. Time**: 15-20 minutes
**Cost**: Free tier available
**Support**: railway.app has good documentation

**Ready? Start with STEP 1! 🚀**
