#!/bin/bash

# StaySpot cPanel Deployment Script
# Usage: ./deploy-cpanel.sh <cpanel_user> <cpanel_host>

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CPANEL_USER=${1:-"username"}
CPANEL_HOST=${2:-"hosting.domain.com"}
REMOTE_PATH="/home/$CPANEL_USER/public_html"
API_REMOTE_PATH="$REMOTE_PATH/api"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
print_header() {
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Main deployment
main() {
    print_header "🚀 StaySpot cPanel Deployment"
    
    print_info "cPanel User: $CPANEL_USER"
    print_info "cPanel Host: $CPANEL_HOST"
    print_info "Local Directory: $LOCAL_DIR"
    
    # Step 1: Build
    print_header "Step 1: Building Application"
    
    if [ ! -f "$LOCAL_DIR/package.json" ]; then
        print_error "package.json not found. Make sure you're in the project root directory."
        exit 1
    fi
    
    print_info "Installing dependencies..."
    cd "$LOCAL_DIR"
    npm install
    print_success "Dependencies installed"
    
    print_info "Building backend..."
    npm run build:backend
    print_success "Backend built"
    
    print_info "Building frontend..."
    npm run build:frontend
    print_success "Frontend built"
    
    # Step 2: Upload Backend
    print_header "Step 2: Uploading Backend"
    
    if [ ! -d "$LOCAL_DIR/backend/dist" ]; then
        print_error "Backend dist directory not found"
        exit 1
    fi
    
    print_info "Uploading backend files to $CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH..."
    scp -r "$LOCAL_DIR/backend/dist/"* "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH/" 2>/dev/null || print_warning "Some files may have failed to upload"
    
    print_info "Uploading backend package files..."
    scp "$LOCAL_DIR/backend/package.json" "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH/"
    scp "$LOCAL_DIR/backend/package-lock.json" "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH/"
    
    print_success "Backend uploaded"
    
    # Step 3: Upload Frontend
    print_header "Step 3: Uploading Frontend"
    
    if [ ! -d "$LOCAL_DIR/frontend/dist" ]; then
        print_error "Frontend dist directory not found"
        exit 1
    fi
    
    print_info "Uploading frontend files to $CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH..."
    scp -r "$LOCAL_DIR/frontend/dist/"* "$CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH/" 2>/dev/null || print_warning "Some files may have failed to upload"
    
    print_success "Frontend uploaded"
    
    # Step 4: Configuration Files
    print_header "Step 4: Checking Configuration Files"
    
    if [ -f "$LOCAL_DIR/backend/.env" ]; then
        print_warning "Found .env file. You should upload this manually for security:"
        print_info "scp backend/.env $CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH/"
    else
        print_warning "No .env file found. Create one on the server with your configuration:"
        print_info "SSH to $CPANEL_USER@$CPANEL_HOST and create $API_REMOTE_PATH/.env"
    fi
    
    # Step 5: Check htaccess files
    print_header "Step 5: Uploading Configuration Files"
    
    # Create .htaccess files if they don't exist
    if [ ! -f "$LOCAL_DIR/.htaccess-api" ]; then
        print_info "Creating .htaccess for API..."
        cat > /tmp/.htaccess-api << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ http://localhost:8080/$1 [P,L]
</IfModule>
EOF
        scp /tmp/.htaccess-api "$CPANEL_USER@$CPANEL_HOST:$API_REMOTE_PATH/.htaccess"
        print_success ".htaccess for API uploaded"
    fi
    
    if [ ! -f "$LOCAL_DIR/.htaccess-frontend" ]; then
        print_info "Creating .htaccess for Frontend..."
        cat > /tmp/.htaccess-frontend << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [QSA,L]
</IfModule>
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/* "access plus 1 year"
</IfModule>
EOF
        scp /tmp/.htaccess-frontend "$CPANEL_USER@$CPANEL_HOST:$REMOTE_PATH/.htaccess"
        print_success ".htaccess for Frontend uploaded"
    fi
    
    # Final Steps
    print_header "🎉 Deployment Complete!"
    
    echo ""
    print_success "Backend uploaded to: $API_REMOTE_PATH"
    print_success "Frontend uploaded to: $REMOTE_PATH"
    
    echo ""
    print_warning "Remaining Manual Steps:"
    echo "1. SSH into $CPANEL_USER@$CPANEL_HOST"
    echo "2. Navigate to $API_REMOTE_PATH"
    echo "3. Run: npm install --production"
    echo "4. Create .env file with your configuration"
    echo "5. Run database migrations: npm run migrate"
    echo "6. Restart Node.js application via cPanel"
    echo "7. Test: curl https://api.stayspot.com/health"
    
    echo ""
    print_info "SSH Command: ssh $CPANEL_USER@$CPANEL_HOST"
    echo ""
}

# Run main function
main "$@"
