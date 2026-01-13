#!/bin/bash

# StaySpot Backend Local Setup Script
# This script sets up everything for local development with SQLite

set -e

echo "📦 StaySpot Backend Setup"
echo "========================"

cd "$(dirname "$0")/backend"

# Check Node version
echo "✓ Checking Node.js version..."
node_version=$(node --version | cut -d'v' -f2)
echo "  Node.js: v$node_version"

# Install dependencies
echo "✓ Installing dependencies..."
npm install > /dev/null 2>&1 || npm install

# Check if database file exists
if [ ! -f "stayspot.db" ]; then
    echo "✓ Creating SQLite database..."
    touch stayspot.db
fi

# Show environment info
echo ""
echo "📝 Environment Configuration:"
echo "  - DATABASE: SQLite (stayspot.db)"
echo "  - NODE_ENV: development"
echo "  - PORT: 5000"
echo "  - FRONTEND_URL: http://localhost:3000"

echo ""
echo "🚀 Ready to start!"
echo ""
echo "To run the backend, execute:"
echo "  cd backend && npm run dev"
echo ""
echo "Backend will be available at: http://localhost:5000"
echo "API Health Check: http://localhost:5000/api/health"
