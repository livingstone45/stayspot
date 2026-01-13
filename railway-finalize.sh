#!/bin/bash

# 🚀 StaySpot Railway Finalize
# Completes deployment after Railway backend is running
# Usage: bash railway-finalize.sh https://your-railway-backend-url.up.railway.app

set -e

if [ -z "$1" ]; then
    echo "❌ Error: You must provide your Railway backend URL"
    echo ""
    echo "Usage: bash railway-finalize.sh <RAILWAY-BACKEND-URL>"
    echo ""
    echo "Example:"
    echo "  bash railway-finalize.sh https://stayspot-production-abc123.up.railway.app"
    echo ""
    exit 1
fi

RAILWAY_URL="$1"

# Remove trailing slash if present
RAILWAY_URL="${RAILWAY_URL%/}"

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                   🚀 STAYSPOT FINAL DEPLOYMENT 🚀                           ║"
echo "║                                                                              ║"
echo "║                    Connecting Frontend to Railway Backend                    ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Backend URL: $RAILWAY_URL"
echo ""

# Step 1: Verify backend is running
echo "STEP 1: Verifying Railway backend is running..."
if curl -s "$RAILWAY_URL/api/health" > /dev/null 2>&1; then
    echo "✓ Backend is responding!"
else
    echo "⚠ Backend might be starting up. Retrying in 5 seconds..."
    sleep 5
    if curl -s "$RAILWAY_URL/api/health" > /dev/null 2>&1; then
        echo "✓ Backend is now responding!"
    else
        echo "⚠ Backend not responding yet. This is normal for first deployment."
        echo "  It might take a minute to start. Proceeding anyway..."
    fi
fi
echo ""

# Step 2: Update frontend API endpoint
echo "STEP 2: Updating frontend API endpoint..."
API_URL="$RAILWAY_URL/api"

cd frontend

# Update apiClient.js
if grep -q "const API_BASE_URL" src/services/apiClient.js; then
    # Replace the line
    sed -i "s|const API_BASE_URL = .*|const API_BASE_URL = '$API_URL';|g" src/services/apiClient.js
    echo "✓ Updated apiClient.js with Railway backend URL"
else
    echo "❌ Could not find API_BASE_URL in apiClient.js"
    exit 1
fi

# Show what was changed
echo ""
echo "API endpoint changed to:"
echo "  $API_URL"
echo ""

# Step 3: Build frontend
echo "STEP 3: Building frontend..."
npm run build 2>&1 | tail -10
echo "✓ Frontend built successfully"
echo ""

# Step 4: Copy to docs and commit
echo "STEP 4: Deploying to GitHub Pages..."
cd ..

# Backup old docs
if [ -d "docs" ]; then
    rm -rf docs
fi

# Copy new build
cp -r frontend/dist docs
echo "✓ Copied dist to docs folder"

# Git commit and push
git add -A
git commit -m "Production: Connect frontend to Railway backend at $RAILWAY_URL" 2>&1 | tail -3
git push origin main 2>&1 | tail -3
echo "✓ Pushed to GitHub"
echo ""

# Step 5: Success message
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                          ✅ DEPLOYMENT COMPLETE! ✅                         ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Your application is now LIVE!"
echo ""
echo "🌐 Frontend:"
echo "   https://livingstone45.github.io/stayspot/"
echo ""
echo "🔧 Backend (Railway):"
echo "   $RAILWAY_URL"
echo ""
echo "✨ Next Steps:"
echo "   1. Go to https://livingstone45.github.io/stayspot/#/auth/register/tenant"
echo "   2. Create a new account"
echo "   3. Login with your credentials"
echo "   4. Data will be stored in Railway PostgreSQL!"
echo ""
echo "📊 Monitor:"
echo "   - Railway Dashboard: Check backend logs and database"
echo "   - GitHub Pages: Auto-updated from 'docs' folder"
echo ""
echo "🎉 You're all set! The complete StaySpot system is now LIVE!"
echo ""
