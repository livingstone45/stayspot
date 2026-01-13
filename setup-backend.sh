#!/bin/bash
# Backend deployment and local testing script

set -e

echo "🚀 StaySpot Backend Setup"
echo "======================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Navigate to backend
cd "$(dirname "$0")/backend" || exit 1

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your database credentials"
fi

# Check if vercel is installed
if ! npx vercel --version &> /dev/null; then
    echo ""
    echo "📥 Installing Vercel CLI..."
    npm install --save-dev vercel
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your database credentials"
echo "2. For local testing: npm run dev"
echo "3. For Vercel deployment: npx vercel --prod"
echo "4. Visit: https://vercel.com/new to connect GitHub"
