# Backend URL Configuration - Setup Guide

Your backend now has automatic URL configuration based on environment.

## How It Works

The backend automatically sets the correct URLs based on `NODE_ENV`:

```javascript
// Automatically detects environment:
NODE_ENV=production  → stayspot.co.ke/api (port 8080)
NODE_ENV=staging     → testly.stayspot.co.ke/api (port 8081)
NODE_ENV=development → localhost:8080 (port 8080)
```

## Files Created

### 1. **`backend/src/config/urls.js`**
   - Contains URL configurations for all environments
   - Edit this file to change URLs

### 2. **`backend/src/utils/urlHelper.js`**
   - Helper functions to get URLs anywhere in your code
   - Functions available:
     - `getBackendUrl()` - Get backend API URL
     - `getFrontendUrl()` - Get frontend URL
     - `getCorsOrigin()` - Get CORS allowed origin
     - `getSocketUrl()` - Get Socket.IO URL
     - `getPort()` - Get port number
     - `getEnvironment()` - Get current environment

## How to Use in Your Code

### Option 1: Use in server setup
```javascript
const { getPort, getCorsOrigin, getBackendUrl } = require('./utils/urlHelper');

const PORT = getPort();
console.log(`Server running at ${getBackendUrl()}`);
```

### Option 2: Use in any route/controller
```javascript
const { getFrontendUrl } = require('../utils/urlHelper');

// In email templates, redirects, etc.
const emailLink = `${getFrontendUrl()}/reset-password?token=${token}`;
```

## Environment Variables (.env)

You only need to set `NODE_ENV` in your .env files:

**Production (.env.production)**
```
NODE_ENV=production
PORT=8080
```

**Testing (.env.testing)**
```
NODE_ENV=staging
PORT=8081
```

**Development (.env)**
```
NODE_ENV=development
PORT=8080
```

That's it! The rest of the URLs are automatically configured.

## Where URLs Are Used

Your backend already uses these URLs for:

✅ CORS Configuration (Socket.IO & Express)
✅ Email Links (password reset, verification, etc.)
✅ Redirects
✅ API Response Links

## To Use in Other Places

If you need URLs elsewhere (middleware, services, etc.):

```javascript
const { getBackendUrl, getFrontendUrl } = require('./utils/urlHelper');

// Example: In email service
function sendResetEmail(user, token) {
  const resetLink = `${getFrontendUrl()}/reset-password?token=${token}`;
  // Send email...
}

// Example: In error handler
function handleError(error) {
  const contactUrl = `${getFrontendUrl()}/support`;
  // Include in response...
}
```

## Testing

Verify URLs are correct:

```bash
# Development
NODE_ENV=development node -e "const { getBackendUrl } = require('./src/utils/urlHelper'); console.log(getBackendUrl())"

# Production
NODE_ENV=production node -e "const { getBackendUrl } = require('./src/utils/urlHelper'); console.log(getBackendUrl())"

# Staging
NODE_ENV=staging node -e "const { getBackendUrl } = require('./src/utils/urlHelper'); console.log(getBackendUrl())"
```

---

Done! Your backend URLs are now automatically configured. ✅
