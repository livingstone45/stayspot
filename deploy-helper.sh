#!/bin/bash
# Quick deployment helper script

echo "🚀 StaySpot Deployment Helper"
echo "=============================="
echo ""

# Show status
echo "📊 Current Deployment Status:"
echo "  ✅ Frontend: https://livingstone45.github.io/stayspot/"
echo "  🔧 Backend: Ready to deploy"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed"
    exit 1
fi

echo "✅ Node.js: $(node --version)"

# Check backend setup
cd "$(dirname "$0")"
if [ ! -d "backend" ]; then
    echo "❌ Backend folder not found"
    exit 1
fi

echo "✅ Backend folder found"
echo ""

# Show next steps
echo "📋 Next Steps:"
echo ""
echo "1️⃣  CREATE DATABASE (5 min)"
echo "   → Go to https://planetscale.com"
echo "   → Create database 'stayspot'"
echo "   → Copy connection string"
echo ""

echo "2️⃣  DEPLOY BACKEND (5 min)"
echo "   → Go to https://vercel.com/new"
echo "   → Connect GitHub repository"
echo "   → Select 'backend' as root directory"
echo "   → Add environment variables (DB_HOST, DB_USER, DB_PASSWORD, etc.)"
echo "   → Deploy"
echo ""

echo "3️⃣  UPDATE FRONTEND (2 min)"
echo "   → Edit frontend/src/services/apiClient.js"
echo "   → Replace API_BASE_URL with your Vercel backend URL"
echo "   → Run: npm run build && git push"
echo ""

echo "4️⃣  TEST (1 min)"
echo "   → Go to https://livingstone45.github.io/stayspot/"
echo "   → Register a new account"
echo "   → Check if data saves to database"
echo ""

echo "📚 Full guide: FULL_DEPLOYMENT_GUIDE.md"
echo ""
