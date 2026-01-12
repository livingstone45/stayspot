#!/bin/bash

echo "🚀 Deploying StaySpot to Netlify..."

# Install Netlify CLI if not present
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy
cd frontend
npm run build
netlify deploy --prod --dir=dist --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN

echo "✅ Deployed to Netlify!"
