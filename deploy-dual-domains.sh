#!/bin/bash

# StaySpot Dual Domain cPanel Deployment Script
# Deploys to both stayspot.co.ke and testly.stayspot.co.ke
# Usage: ./deploy-dual-domains.sh <cpanel_user> <cpanel_host>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
CPANEL_USER=${1:-"username"}
CPANEL_HOST=${2:-"hosting.domain.com"}
REMOTE_PATH="/home/$CPANEL_USER/public_html"
API_REMOTE_PATH_PROD="$REMOTE_PATH/api"
API_REMOTE_PATH_TEST="$REMOTE_PATH/testly/api"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
print_header() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Main deployment
main() {
    print_header "🚀 StaySpot Dual Domain cPanel Deployment"
    
    print_info "cPanel User: $CPANEL_USER"
    print_info "cPanel Host: $CPANEL_HOST"
    print_info "Local Directory: $LOCAL_DIR"
    echo ""
    
    # Verify we're in the right directory
    if [ ! -f "$LOCAL_DIR/package.json" ]; then
        print_error "package.json not found. Run this script from project root."
    fi
    
    # Step 1: Build
    print_header "Step 1: Building Application"
    
    print_info "Installing dependencies..."
    cd "$LOCAL_DIR"
    npm install
    print_success "Dependencies installed"
    
    print_info "Building backend..."
    npm run build:backend
    print_success "Backend built (dist/)"
    
    print_info "Building frontend..."
    npm run build:frontend
    print_success "Frontend built (dist/)"
    
    # Verify builds exist
    [ -d "$LOCAL_DIR/backend/dist" ] || print_error "Backend dist not found"
    [ -d "$LOCAL_DIR/frontend/dist" ] || print_error "Frontend dist not found"
    
    # Step 2: Deploy Production (stayspot.co.ke)
    print_header "Step 2: Deploying Production (stayspot.co.ke)"
    
    print_info "Creating remote directories..."
    ssh "$CPANEL_USER@$CPANEL_HOST" "mkdir -p $API_REMOTE_PATH_PROD" 2>/dev/null || true
    print_success "Directories ready"
    
    print_info "Uploading backend files..."
    scp -r "$LOCAL_DIR/backend/dist/"* "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH_PROD/" 2>/dev/null || print_warning "Some backend files may have upload issues"
    scp "$LOCAL_DIR/backend/package.json" "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH_PROD/"
    scp "$LOCAL_DIR/backend/package-lock.json" "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH_PROD/"
    print_success "Backend uploaded to production"
    
    print_info "Uploading frontend files..."
    scp -r "$LOCAL_DIR/frontend/dist/"* "$CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH/" 2>/dev/null || print_warning "Some frontend files may have upload issues"
    print_success "Frontend uploaded to production"
    
    # Upload .env file for production (IMPORTANT!)
    if [ -f "$LOCAL_DIR/backend/.env.production" ]; then
        print_info "Uploading production .env file..."
        scp "$LOCAL_DIR/backend/.env.production" "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH_PROD/.env"
        print_success ".env uploaded (production)"
    else
        print_warning "No .env.production found. You must manually upload .env to $API_REMOTE_PATH_PROD/"
    fi
    
    # Step 3: Deploy Testing (testly.stayspot.co.ke)
    print_header "Step 3: Deploying Testing (testly.stayspot.co.ke)"
    
    print_info "Creating remote testing directories..."
    ssh "$CPANEL_USER@$CPANEL_HOST" "mkdir -p $API_REMOTE_PATH_TEST" 2>/dev/null || true
    print_success "Testing directories ready"
    
    print_info "Uploading backend files to testing..."
    scp -r "$LOCAL_DIR/backend/dist/"* "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH_TEST/" 2>/dev/null || print_warning "Some backend files may have upload issues"
    scp "$LOCAL_DIR/backend/package.json" "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH_TEST/"
    scp "$LOCAL_DIR/backend/package-lock.json" "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH_TEST/"
    print_success "Backend uploaded to testing"
    
    print_info "Uploading frontend files to testing..."
    scp -r "$LOCAL_DIR/frontend/dist/"* "$CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH/testly/" 2>/dev/null || print_warning "Some frontend files may have upload issues"
    print_success "Frontend uploaded to testing"
    
    # Upload .env file for testing
    if [ -f "$LOCAL_DIR/backend/.env.testing" ]; then
        print_info "Uploading testing .env file..."
        scp "$LOCAL_DIR/backend/.env.testing" "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH_TEST/.env"
        print_success ".env uploaded (testing)"
    else
        print_warning "No .env.testing found. You must manually upload .env to $API_REMOTE_PATH_TEST/"
    fi
    
    # Step 4: Upload .htaccess files
    print_header "Step 4: Configuring Apache Rewrites (.htaccess)"
    
    # Production .htaccess
    print_info "Creating production .htaccess..."
    ssh "$CPANEL_USER@$CPANEL_HOST" 'cat > $HOME/public_html/.htaccess << '\''EOF'\''
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # API routes to Node.js port 8080
    RewriteRule ^api/(.*)$ http://localhost:8080/api/$1 [P,L]
    
    # Everything else to React index.html
    RewriteRule ^(.*)$ /index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
EOF'
    print_success "Production .htaccess created"
    
    # Production API .htaccess
    print_info "Creating production API .htaccess..."
    ssh "$CPANEL_USER@$CPANEL_HOST" 'cat > $HOME/public_html/api/.htaccess << '\''EOF'\''
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /api/
    
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:8080/api/$1 [P,L]
</IfModule>
EOF'
    print_success "Production API .htaccess created"
    
    # Testing .htaccess
    print_info "Creating testing .htaccess..."
    ssh "$CPANEL_USER@$CPANEL_HOST" 'cat > $HOME/public_html/testly/.htaccess << '\''EOF'\''
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # API routes to Node.js port 8081 (DIFFERENT PORT!)
    RewriteRule ^api/(.*)$ http://localhost:8081/api/$1 [P,L]
    
    # Everything else to React index.html
    RewriteRule ^(.*)$ /index.html [QSA,L]
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
EOF'
    print_success "Testing .htaccess created"
    
    # Testing API .htaccess
    print_info "Creating testing API .htaccess..."
    ssh "$CPANEL_USER@$CPANEL_HOST" 'cat > $HOME/public_html/testly/api/.htaccess << '\''EOF'\''
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /api/
    
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:8081/api/$1 [P,L]
</IfModule>
EOF'
    print_success "Testing API .htaccess created"
    
    # Step 5: Instructions for cPanel
    print_header "Step 5: Manual cPanel Configuration Required"
    
    echo ""
    echo -e "${YELLOW}⚠️  You must complete these steps manually in cPanel:${NC}"
    echo ""
    echo "1️⃣  Node.js Selector - Production (stayspot.co.ke)"
    echo "   - Domain: stayspot.co.ke"
    echo "   - Root: /home/$CPANEL_USER/public_html/api"
    echo "   - Startup File: src/server.js"
    echo "   - Node Version: 18.x or higher"
    echo "   - Environment: Production"
    echo ""
    echo "2️⃣  Node.js Selector - Testing (testly.stayspot.co.ke)"
    echo "   - Domain: testly.stayspot.co.ke"
    echo "   - Root: /home/$CPANEL_USER/public_html/testly/api"
    echo "   - Startup File: src/server.js"
    echo "   - Node Version: 18.x or higher"
    echo "   - Environment: Staging"
    echo ""
    echo "3️⃣  Enable SSL Certificates (AutoSSL or Let's Encrypt)"
    echo "   - stayspot.co.ke"
    echo "   - testly.stayspot.co.ke"
    echo ""
    echo "4️⃣  Create MySQL Databases (if not already created)"
    echo "   - Production: ${CPANEL_USER}_stayspot_prod"
    echo "   - Testing: ${CPANEL_USER}_stayspot_test"
    echo ""
    
    # Final summary
    print_header "✅ Deployment Complete!"
    
    echo ""
    echo "📋 Deployment Summary:"
    echo ""
    echo "Production (stayspot.co.ke):"
    echo "  Frontend: https://stayspot.co.ke"
    echo "  Backend:  https://stayspot.co.ke/api"
    echo "  Port:     8080"
    echo "  Root:     /home/$CPANEL_USER/public_html/"
    echo ""
    echo "Testing (testly.stayspot.co.ke):"
    echo "  Frontend: https://testly.stayspot.co.ke"
    echo "  Backend:  https://testly.stayspot.co.ke/api"
    echo "  Port:     8081"
    echo "  Root:     /home/$CPANEL_USER/public_html/testly/"
    echo ""
    
    echo "🔗 Test your deployment:"
    echo "   curl -I https://stayspot.co.ke"
    echo "   curl -I https://stayspot.co.ke/api/health"
    echo "   curl -I https://testly.stayspot.co.ke"
    echo "   curl -I https://testly.stayspot.co.ke/api/health"
    echo ""
    
    echo "📚 Full guide: DUAL_DOMAIN_CPANEL_DEPLOYMENT.md"
    echo ""
}

# Run main function
main
