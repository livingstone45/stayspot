#!/bin/bash

# GitHub Pages Deployment Setup Script
# This script initializes Git and pushes your code to GitHub

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}StaySpot GitHub Pages Setup${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your GitHub repository name (default: stayspot): " REPO_NAME
REPO_NAME=${REPO_NAME:-stayspot}

GITHUB_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo -e "${YELLOW}⚠️  Make sure you have created the repository on GitHub first!${NC}"
echo -e "${YELLOW}Go to: https://github.com/new${NC}"
echo ""
read -p "Press Enter when you've created the GitHub repository..."

echo ""
echo -e "${BLUE}Initializing Git...${NC}"

# Check if git is already initialized
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${GREEN}✅ Git already initialized${NC}"
fi

# Add remote
echo ""
echo -e "${BLUE}Adding GitHub remote...${NC}"
git remote remove origin 2>/dev/null || true
git remote add origin "$GITHUB_URL"
echo -e "${GREEN}✅ Remote added: $GITHUB_URL${NC}"

# Stage files
echo ""
echo -e "${BLUE}Staging files...${NC}"
git add .
echo -e "${GREEN}✅ Files staged${NC}"

# Commit
echo ""
echo -e "${BLUE}Creating commit...${NC}"
git commit -m "Initial commit: StaySpot Property Management System" || echo "Nothing to commit"
echo -e "${GREEN}✅ Commit created${NC}"

# Switch to main branch
echo ""
echo -e "${BLUE}Setting up main branch...${NC}"
git branch -M main
echo -e "${GREEN}✅ Using main branch${NC}"

# Push
echo ""
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push -u origin main
echo -e "${GREEN}✅ Pushed to GitHub${NC}"

echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. Under 'Build and deployment':"
echo "   - Branch: gh-pages"
echo "   - Folder: / (root)"
echo "   - Click Save"
echo ""
echo "3. Wait 1-2 minutes for GitHub to build your site"
echo ""
echo -e "${YELLOW}Your website will be at:${NC}"
echo "https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo ""
echo -e "${YELLOW}To set custom domain (optional):${NC}"
echo "1. Update DNS CNAME to: $GITHUB_USERNAME.github.io"
echo "2. Add custom domain in GitHub Pages settings"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
