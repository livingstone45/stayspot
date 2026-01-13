# ✅ Pre-Deployment Checklist

## 📋 Backend Files

- [x] `backend/api/index.js` - Vercel entry point
- [x] `backend/vercel.json` - Vercel configuration
- [x] `backend/.env.local` - Local environment (template created)
- [x] `backend/.env.example` - Environment template
- [x] `backend/package.json` - Dependencies installed
- [x] `backend/src/` - Express app structure ready

## 📋 Frontend Files

- [x] `frontend/src/services/apiClient.js` - Production API client
- [x] `frontend/src/services/mockAuth.js` - Fallback auth (test purposes)
- [x] `frontend/src/hooks/useAuth.js` - Auth context with multi-key support
- [x] Frontend deployed to GitHub Pages

## 📋 Documentation

- [x] `FULL_DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- [x] `DEPLOYMENT_READY.md` - Status summary
- [x] `VERCEL_SETUP.md` - Quick Vercel reference
- [x] `BACKEND_DEPLOYMENT.md` - Backend deployment overview
- [x] `backend/VERCEL_DEPLOYMENT.md` - Technical details
- [x] `deploy-helper.sh` - Quick start script

## 🔧 Prerequisites for Deployment

### For You to Complete:

- [ ] **PlanetScale Account** - Sign up at https://planetscale.com
- [ ] **Create Database** - Create "stayspot" database
- [ ] **Get Credentials** - Copy connection string
- [ ] **Vercel Account** - Sign up at https://vercel.com (free)
- [ ] **Connect GitHub** - Link your GitHub account to Vercel

### Already Completed:

- [x] Node.js 16+ installed
- [x] npm/vercel CLI available
- [x] Backend code ready
- [x] Frontend deployed
- [x] API client configured

## 🚀 Deployment Steps (In Order)

### Phase 1: Database Setup (5 min)
- [ ] Go to https://planetscale.com
- [ ] Create account with GitHub
- [ ] Create database named "stayspot"
- [ ] Get connection details
- [ ] Test connection (optional)

### Phase 2: Backend Deployment (5 min)
- [ ] Go to https://vercel.com/new
- [ ] Import GitHub repository
- [ ] Set root directory to "backend"
- [ ] Configure environment variables
- [ ] Deploy to Vercel
- [ ] Get production URL
- [ ] Test health endpoint

### Phase 3: Frontend Update (3 min)
- [ ] Update `apiClient.js` with backend URL
- [ ] Create `frontend/.env.local`
- [ ] Run `npm run build`
- [ ] Copy `frontend/dist` to `docs/`
- [ ] Commit and push to GitHub
- [ ] Wait 2-3 minutes for GitHub Pages update

### Phase 4: Testing (5 min)
- [ ] Visit https://livingstone45.github.io/stayspot/
- [ ] Register new account
- [ ] Login with credentials
- [ ] Check database for user entry
- [ ] Test different user roles
- [ ] Verify no console errors

## 🎯 Expected Outcomes

After completion:

| Component | Expected Result |
|-----------|-----------------|
| Frontend | ✅ Loads at https://livingstone45.github.io/stayspot/ |
| Backend | ✅ Responds to /api/health endpoint |
| Database | ✅ Contains user registration data |
| Auth | ✅ Real backend authentication (no mock) |
| API | ✅ Real data persistence |

## 🐛 Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Backend won't deploy | Check env vars on Vercel dashboard |
| "Connection refused" | Verify PlanetScale credentials |
| "CORS error" | Check FRONTEND_URL in backend env vars |
| "Module not found" | Run `npm install` in backend folder |
| Still seeing mock auth | Clear browser cache + rebuild frontend |

## 📊 Verification Commands

After deployment, test with:

```bash
# Test backend health
curl https://your-backend-url.vercel.app/api/health

# Test database connection
mysql -h your_host -u your_user -p'your_password' stayspot -e "SELECT * FROM Users LIMIT 1;"

# Test frontend API
curl https://your-backend-url.vercel.app/api/auth/me -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 Files to Keep Safe

- JWT_SECRET (generate a new one for production)
- Database credentials (never commit to GitHub)
- Environment variables (store on Vercel, not locally)

---

**Status**: All files prepared ✅ | Awaiting your Vercel + PlanetScale setup 🚀

Start here: https://planetscale.com
