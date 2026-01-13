#!/bin/bash

# 🚀 StaySpot Railway Deployment Helper
# This script guides you through the complete Railway deployment

set -e

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                     🚀 STAYSPOT RAILWAY DEPLOYMENT 🚀                       ║"
echo "║                                                                              ║"
echo "║              This script will help you deploy to Railway                     ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Generate JWT Secret
echo "STEP 1: Generating Secure JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✓ JWT_SECRET generated: $JWT_SECRET"
echo ""

# Step 2: Display Railway environment variables needed
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                    RAILWAY ENVIRONMENT VARIABLES                             ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "Copy these variables to Railway dashboard → Your Backend Service → Variables:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. DATABASE_URL"
echo "   Value: postgresql://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]"
echo "   (Get from Railway PostgreSQL service)"
echo ""
echo "2. JWT_SECRET"
echo "   Value: $JWT_SECRET"
echo ""
echo "3. NODE_ENV"
echo "   Value: production"
echo ""
echo "4. FRONTEND_URL"
echo "   Value: https://livingstone45.github.io"
echo ""
echo "5. PORT"
echo "   Value: 3000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: Save JWT secret to .env.local
echo "Saving JWT_SECRET to backend/.env.local..."
if grep -q "JWT_SECRET=" backend/.env.local; then
    # Update existing
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|g" backend/.env.local
else
    # Add new
    echo "JWT_SECRET=$JWT_SECRET" >> backend/.env.local
fi
echo "✓ JWT_SECRET saved"
echo ""

# Step 4: Display instructions
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                          NEXT STEPS IN RAILWAY                               ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Go to https://railway.app"
echo "2. Sign in with GitHub"
echo "3. Click 'New' → 'GitHub Repo' → Select 'stayspot'→ Deploy"
echo "4. Click 'New' → 'PostgreSQL' → Railway creates it automatically"
echo "5. In PostgreSQL service → Copy DATABASE_URL value"
echo "6. In Backend service → 'Variables' tab:"
echo "   - Add DATABASE_URL (from PostgreSQL)"
echo "   - Add JWT_SECRET: $JWT_SECRET"
echo "   - Add NODE_ENV: production"
echo "   - Add FRONTEND_URL: https://livingstone45.github.io"
echo "   - Add PORT: 3000"
echo "7. Wait for automatic redeploy (green checkmark)"
echo "8. Click backend service → copy 'Public URL' or 'Deployment URL'"
echo ""
echo "Save that URL! You'll need it for the frontend."
echo ""

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                     RAILWAY BUTTON LOCATIONS                                 ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Deploy from GitHub:"
echo "   Railway Dashboard → 'New' button → 'GitHub Repo' → search 'stayspot'"
echo ""
echo "📍 Create PostgreSQL:"
echo "   Railway Dashboard → 'New' button → 'PostgreSQL'"
echo ""
echo "📍 Get CONNECTION STRING from PostgreSQL:"
echo "   PostgreSQL Service → Variables tab → copy DATABASE_URL"
echo ""
echo "📍 Add Variables to Backend:"
echo "   Backend Service → Variables tab → Add each variable"
echo ""
echo "📍 Get Backend URL:"
echo "   Backend Service → look for 'Public URL' or 'Deployment URL'"
echo ""
echo "📍 Check Deployment Status:"
echo "   Backend Service → 'Deployments' tab → should show green checkmark"
echo ""

echo "🎯 After you complete Railway setup, come back and run:"
echo ""
echo "   bash railway-finalize.sh <YOUR-RAILWAY-BACKEND-URL>"
echo ""
echo "Example:"
echo "   bash railway-finalize.sh https://stayspot-production-abc123.up.railway.app"
echo ""
echo "That will:"
echo "✓ Update frontend to use your Railway backend"
echo "✓ Rebuild the frontend"
echo "✓ Deploy to GitHub Pages"
echo "✓ Everything will be LIVE!"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
