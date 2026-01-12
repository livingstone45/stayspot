#!/bin/bash

# Full Stack Deployment Setup
# Automatically sets up GitHub for frontend + backend + database deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Full Stack Automatic Deployment      ║${NC}"
echo -e "${BLUE}║   Frontend + Backend + Database        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Get GitHub info
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter repository name (default: stayspot): " REPO_NAME
REPO_NAME=${REPO_NAME:-stayspot}

GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo -e "${YELLOW}Repository will be created at:${NC}"
echo "$GITHUB_URL"
echo ""

# Verify repository exists
echo -e "${BLUE}Verifying GitHub repository exists...${NC}"
if curl -s -f "https://api.github.com/repos/$GITHUB_USERNAME/$REPO_NAME" > /dev/null; then
    echo -e "${GREEN}✅ Repository found${NC}"
else
    echo -e "${RED}❌ Repository not found!${NC}"
    echo -e "${YELLOW}Create it at: https://github.com/new${NC}"
    echo "  - Name: $REPO_NAME"
    echo "  - Visibility: PUBLIC"
    exit 1
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Setting up Git...${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo -e "${BLUE}Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${GREEN}✅ Git already initialized${NC}"
fi

# Remove old remote and add new one
git remote remove origin 2>/dev/null || true
git remote add origin "$GITHUB_URL"
echo -e "${GREEN}✅ Remote configured${NC}"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Building application...${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Build
npm install
npm run build:backend
npm run build:frontend

echo -e "${GREEN}✅ Build successful${NC}"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Preparing for deployment...${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Stage all files
git add .
echo -e "${GREEN}✅ Files staged${NC}"

# Create initial commit
git commit -m "🚀 Initial commit: Full stack StaySpot application" || echo -e "${YELLOW}⚠️  Commit skipped (nothing to commit)${NC}"
echo -e "${GREEN}✅ Commit created${NC}"

# Set main branch
git branch -M main
echo -e "${GREEN}✅ Using main branch${NC}"

# Push to GitHub
echo ""
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push -u origin main
echo -e "${GREEN}✅ Pushed to GitHub${NC}"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo "1️⃣  Enable GitHub Pages:"
echo "   Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "   - Branch: gh-pages"
echo "   - Folder: / (root)"
echo "   - Click Save"
echo ""

echo "2️⃣  Watch deployment:"
echo "   Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/actions"
echo ""

echo "3️⃣  Access your website:"
echo "   Frontend: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo "   or (with custom domain): https://stayspot.co.ke"
echo ""

echo "4️⃣  Download backend:"
echo "   Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/releases"
echo ""

echo -e "${YELLOW}🚀 Making Updates:${NC}"
echo "   git add ."
echo "   git commit -m 'Your change'"
echo "   git push origin main"
echo ""
echo "   (Automatic deployment happens in ~3 minutes)"
echo ""

echo -e "${GREEN}✨ Your full stack is now being deployed automatically! ✨${NC}"
echo ""
