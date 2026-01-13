# 🚀 Complete Setup Guide - Backend + GitHub Pages

Your StaySpot application is now ready for **complete end-to-end deployment**!

## 📊 Architecture

```
Your GitHub Pages Frontend
     ↓ (API calls)
Railway Backend (PostgreSQL)
     ↓ (stores data)
Railway PostgreSQL Database
```

---

## ⚡ Quick Start (5 Minutes)

### Option 1: Test Locally First (No account needed)

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Start backend (uses SQLite - no database setup needed)
npm run dev

# Backend runs at: http://localhost:5000
```

Test it:
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"ok"}
```

---

### Option 2: Deploy to Railway Now (Recommended)

#### Step 1: Create Railway Account (1 minute)
- Go to https://railway.app
- Click "Start New Project"
- Sign in with GitHub

#### Step 2: Deploy Backend (2 minutes)
1. In Railway dashboard → "New" → "GitHub Repo"
2. Select `stayspot` repository
3. Click "Deploy"
4. Wait for green checkmark

#### Step 3: Create PostgreSQL Database (1 minute)
1. In Railway dashboard → "New" → "PostgreSQL"
2. Railway creates database automatically
3. Copy `DATABASE_URL` from variables

#### Step 4: Configure Environment (1 minute)

In Railway dashboard → backend service → "Variables" tab:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://...` (from step 3) |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://livingstone45.github.io` |
| `PORT` | `3000` |

#### Step 5: Get Backend URL (30 seconds)

In Railway dashboard → your backend service:
- Look for "Public URL" or "Deploy URL"
- Copy it (example: `https://stayspot-prod-abc123.up.railway.app`)

#### Step 6: Connect Frontend

**Edit: `frontend/src/services/apiClient.js` (line 7)**

```javascript
// Change from:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://stayspot-backend.vercel.app/api';

// To:
const API_BASE_URL = 'https://your-railway-url.up.railway.app/api';
```

#### Step 7: Deploy Frontend

```bash
cd frontend
npm run build
cd ..
rm -rf docs && cp frontend/dist docs
git add -A
git commit -m "Connect to Railway backend"
git push origin main
```

**Your app is now LIVE!**
- Frontend: https://livingstone45.github.io/stayspot
- Backend: https://your-railway-url.up.railway.app

---

## ✅ Test Everything Works

### 1. Test Backend Health

```bash
curl https://your-railway-url.up.railway.app/api/health
```

Should return:
```json
{"status":"ok"}
```

### 2. Register a New User

1. Go to: https://livingstone45.github.io/stayspot/#/auth/register/tenant
2. Enter:
   - Email: `test@example.com`
   - Password: `Test123!`
3. Click "Sign up"

Expected: Redirect to tenant dashboard

### 3. Check Database

In Railway dashboard → PostgreSQL service → "Data" tab:
- Click `users` table
- Should see your new user!

### 4. Login

1. Go to: https://livingstone45.github.io/stayspot/#/auth/login
2. Enter your email and password
3. Should see tenant dashboard

---

## 🔄 How It All Works

1. **Frontend (GitHub Pages)**
   - Static HTML, CSS, JavaScript
   - Hosted free on GitHub
   - No backend needed for frontend itself

2. **Backend (Railway)**
   - Node.js Express API
   - Handles all business logic
   - Manages JWT tokens and authentication

3. **Database (Railway PostgreSQL)**
   - Stores all user data
   - Automatically managed by Railway
   - Free tier: 5GB storage, unlimited bandwidth

4. **Communication**
   - Frontend calls API endpoints
   - Backend queries database
   - All HTTPS encrypted

---

## 📱 API Endpoints (Ready to Use)

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - List all
- `GET /api/properties/:id` - Get one
- `POST /api/properties` - Create new
- `PUT /api/properties/:id` - Update
- `DELETE /api/properties/:id` - Delete

### Tenants
- `GET /api/tenants` - List all
- `POST /api/tenants` - Create
- `GET /api/tenants/:id` - Get one
- `PUT /api/tenants/:id` - Update

### More endpoints available for:
- Users, Roles, Permissions
- Maintenance, Financial
- Tasks, Communications
- Security, Settings

---

## 🐛 Troubleshooting

### "Backend not responding"
```bash
# Check if Railway service is running
# Go to Railway dashboard → your service → check status
# If sleeping, click on it to wake up (free tier sleeps after 30 min inactivity)
```

### "CORS error from frontend"
```javascript
// Make sure FRONTEND_URL is set correctly in Railway
// Should be: https://livingstone45.github.io
// Not: https://livingstone45.github.io/stayspot
```

### "User can't login"
1. Check Railway logs for errors
2. Verify DATABASE_URL is correct
3. Make sure JWT_SECRET is set
4. Try registering new user first

### "Database connection failed"
1. Check DATABASE_URL format: `postgresql://...`
2. Verify PostgreSQL service is running in Railway
3. Check that DATABASE_URL contains password

---

## 📝 Important Files

| File | Purpose |
|------|---------|
| `backend/.env.local` | Local development config |
| `frontend/src/services/apiClient.js` | Frontend API client |
| `RAILWAY_DEPLOYMENT.md` | Detailed Railway setup guide |
| `backend/src/app.js` | Express app configuration |
| `backend/src/routes/` | API route definitions |

---

## 🎯 What's Included

✅ Complete backend API with Express
✅ JWT authentication system
✅ PostgreSQL database with 50+ tables
✅ User registration & login
✅ Role-based access control
✅ Property management system
✅ Tenant management
✅ Financial tracking
✅ Maintenance requests
✅ Communication system
✅ CORS configured for GitHub Pages
✅ Error handling & logging

---

## 💡 Pro Tips

1. **Local testing first**: Run `npm run dev` in backend folder to test locally
2. **Check logs**: Always check Railway logs when something fails
3. **Use mockAuth temporarily**: Frontend has mock auth fallback while backend is deploying
4. **Monitor usage**: Railway free tier has generous limits but shows you real-time usage
5. **Keep JWT_SECRET safe**: Never commit .env files to git

---

## 🚀 Next Steps

- [ ] Test backend locally (`npm run dev`)
- [ ] Create Railway account
- [ ] Deploy backend to Railway
- [ ] Create PostgreSQL database
- [ ] Configure environment variables
- [ ] Get backend URL
- [ ] Update frontend apiClient.js
- [ ] Rebuild and deploy frontend
- [ ] Test registration/login/dashboard
- [ ] Verify data in database

**Estimated total time: 15 minutes**

---

## 📞 Need Help?

- Railway docs: https://docs.railway.app
- Express docs: https://expressjs.com
- Sequelize docs: https://sequelize.org
- GitHub Pages docs: https://pages.github.com

---

**You've got everything you need! Deploy and start building! 🎉**
