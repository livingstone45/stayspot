# StaySpot - Complete Deployment Guide

## Project Structure

```
stayspot/
├── frontend/           # React app (GitHub Pages)
├── backend/            # Node.js API (Vercel)
└── docs/              # Built frontend (auto-generated)
```

---

## 🚀 Quick Start

### 1. Frontend (Already Running on GitHub Pages)
- URL: https://livingstone45.github.io/stayspot/
- Auto-deploys from `docs/` folder when you push to GitHub

### 2. Backend Setup (New - Vercel)

#### Step 1: Set Up Database (PlanetScale - Free)

1. Go to https://planetscale.com and sign up with GitHub
2. Click "Create a new database"
3. Name: `stayspot`
4. Region: Pick closest to you
5. Get connection string (looks like `mysql://user:pass@host/dbname`)

#### Step 2: Local Development

```bash
cd backend

# Copy environment template
cp .env.example .env.local

# Edit with your database details
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, etc.
nano .env.local

# Install dependencies
npm install

# Start local server
npm run dev
```

Backend runs at: `http://localhost:5000`

Test it:
```bash
curl http://localhost:5000/api/health
```

#### Step 3: Deploy to Vercel

**Option A: Via CLI (Easiest)**
```bash
cd backend
npm install -g vercel  # If not installed
vercel login
vercel env add DB_HOST your_planetscale_host
vercel env add DB_USER your_planetscale_user
vercel env add DB_PASSWORD your_planetscale_password
vercel env add DB_NAME stayspot
vercel env add JWT_SECRET $(openssl rand -base64 32)
vercel deploy --prod
```

**Option B: Via GitHub (Best for automation)**
1. Push backend code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Select "Backend" configuration
5. Add environment variables in dashboard
6. Deploy

After deployment, you'll get: `https://your-vercel-url.vercel.app`

---

## 🔗 Connect Frontend to Backend

1. **Create `.env.local` in frontend directory:**
```bash
cd frontend
cat > .env.local << EOF
REACT_APP_API_URL=https://your-vercel-backend.vercel.app/api
EOF
```

2. **Rebuild frontend:**
```bash
npm run build
cd ..
rm -rf docs && cp frontend/dist docs
git add -A
git commit -m "Update API endpoint for production backend"
git push origin main
```

---

## 📱 Test the Full Stack

### Register New Tenant:
1. Go to https://livingstone45.github.io/stayspot/#/auth/register/tenant
2. Create account with your email
3. Should redirect to `/tenant` dashboard

### Login:
1. Email: your-email@example.com
2. Password: (whatever you set)
3. Data persists in MySQL (via backend API)

### Demo Credentials (Still Work):
- Email: `tenant@example.com`
- Password: `password123`

---

## 🔐 Environment Variables

### Backend (Vercel)
- `DB_HOST`: Database hostname
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: stayspot
- `JWT_SECRET`: Random 32-character string
- `FRONTEND_URL`: https://livingstone45.github.io
- `NODE_ENV`: production

### Frontend (GitHub Pages)
- `REACT_APP_API_URL`: Backend URL

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

### Properties
- `GET /api/properties` - List all
- `GET /api/properties/:id` - Get one
- `POST /api/properties` - Create
- `PUT /api/properties/:id` - Update
- `DELETE /api/properties/:id` - Delete

### Tenants
- `GET /api/tenants` - List all
- `POST /api/tenants` - Create
- `GET /api/tenants/:id` - Get one
- `PUT /api/tenants/:id` - Update

---

## 🐛 Troubleshooting

### Backend won't start locally
```bash
# Check Node version
node --version  # Should be v16+

# Check port 5000 is available
lsof -i :5000

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database connection error
```bash
# Test connection
mysql -h your_host -u your_user -p your_password -e "USE stayspot; SELECT 1;"

# Check .env.local variables
cat .env.local
```

### Frontend still calling mock service
- Edit `frontend/src/services/mockAuth.js` to disable
- Or check that `REACT_APP_API_URL` is set correctly

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- PlanetScale Docs: https://planetscale.com/docs
- Express Guide: https://expressjs.com/
- React API: https://react.dev/reference/react

---

## ✅ Deployment Checklist

- [ ] PlanetScale database created
- [ ] `.env.local` configured in backend
- [ ] Local backend runs: `npm run dev`
- [ ] Backend deployed to Vercel
- [ ] Frontend `REACT_APP_API_URL` set correctly
- [ ] Frontend rebuilt and pushed to GitHub
- [ ] Can login with real credentials
- [ ] Data persists in database
- [ ] No console errors

---

Need help? Check the VERCEL_DEPLOYMENT.md in the backend folder!
