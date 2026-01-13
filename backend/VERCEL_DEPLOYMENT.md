# Backend Deployment to Vercel

## Prerequisites
- Vercel CLI: `npm install -g vercel`
- GitHub account (for Vercel integration)
- MySQL database (use PlanetScale for free tier)

## Step 1: Set Up Database (PlanetScale)

1. Go to https://planetscale.com and sign up
2. Create a new MySQL database
3. Get connection details (host, user, password, database)

## Step 2: Configure Environment Variables

Create `.env.local` in the `backend/` directory:

```bash
DB_HOST=your_planetscale_host
DB_USER=your_planetscale_user
DB_PASSWORD=your_planetscale_password
DB_NAME=stayspot
DB_PORT=3306
JWT_SECRET=your_secure_random_string_here
NODE_ENV=production
FRONTEND_URL=https://livingstone45.github.io
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
cd backend
npm install -g vercel
vercel login
vercel deploy --prod
```

### Option B: Using GitHub Integration

1. Push backend to GitHub repo
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Set Environment Variables in Vercel dashboard:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
5. Deploy

## Step 4: Get Your API URL

After deployment, Vercel will give you a URL like:
```
https://stayspot-backend-abc123.vercel.app
```

## Step 5: Update Frontend

In `frontend/src/services/apiClient.js`, update:

```javascript
const API_BASE_URL = 'https://your-vercel-backend-url.vercel.app/api';
```

## Step 6: Redeploy Frontend

```bash
cd frontend
npm run build
cd ..
rm -rf docs && cp frontend/dist docs
git add -A
git commit -m "Update API endpoint for production"
git push origin main
```

## Local Development

```bash
cd backend
npm install
npm run dev
```

Your backend will run on `http://localhost:5000`

## Database Migrations

If needed, run migrations on Vercel:

```bash
vercel env pull .env.local
npm run migrate
```

## Troubleshooting

- **Connection timeout**: Check PlanetScale firewall rules
- **Module not found**: Run `npm install` in backend
- **JWT errors**: Ensure `JWT_SECRET` is set in environment

For more info: https://vercel.com/docs
