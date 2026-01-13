# Vercel Backend Deployment Setup

## Step 1: Connect to Vercel

Visit: https://vercel.com/new

1. Click "Add GitHub App" or import from GitHub
2. Select the `livingstone45/stayspot` repository
3. Select "Backend" as the root directory location
4. Click "Deploy"

## Step 2: Set Environment Variables on Vercel

After the initial deployment fails (no DB), go to Settings → Environment Variables and add:

### Database (PlanetScale - Free Tier)
First, create a free MySQL database at https://planetscale.com:

1. Sign up with GitHub
2. Create database: `stayspot`
3. Get connection string from "Connect" → "Node.js"
4. Extract these variables:

```
DB_HOST=<your-planetscale-host>
DB_USER=<your-planetscale-user>
DB_PASSWORD=<your-planetscale-password>
DB_NAME=stayspot
DB_PORT=3306
```

### Application
```
JWT_SECRET=KaF+BpVDH0WQpp5WlRHJN5S7WyaQ1ZZB94AtLRmdDS4=
JWT_REFRESH_SECRET=KaF+BpVDH0WQpp5WlRHJN5S7WyaQ1ZZB94AtLRmdDS4=
NODE_ENV=production
FRONTEND_URL=https://livingstone45.github.io
```

## Step 3: Get Your Backend URL

Once deployed, visit: https://vercel.com/dashboard

Find your project and copy the production URL:
```
https://stayspot-backend-<unique-id>.vercel.app
```

## Step 4: Update Frontend

In `frontend/src/services/apiClient.js`, update:
```javascript
const API_BASE_URL = 'https://stayspot-backend-<unique-id>.vercel.app/api';
```

Then rebuild and push to GitHub:
```bash
cd frontend && npm run build
cd ..
rm -rf docs && cp frontend/dist docs
git add docs/
git commit -m "Update backend API URL"
git push origin main
```

## Testing

Test the backend health check:
```bash
curl https://your-vercel-url.vercel.app/api/health
```

Should return:
```json
{"status": "Backend is running", "timestamp": "2026-01-13T..."}
```
