# Frontend-Backend Communication Fix

## Issue Identified
The frontend authentication pages were using hardcoded `fetch()` calls to `http://localhost:5000/api/auth/...` instead of using the configured API service with proper interceptors and error handling.

## Problems Fixed

### 1. **LoginPage.jsx**
- **Before**: Used hardcoded `fetch()` to `http://localhost:5000/api/auth/login`
- **After**: Now uses `authAPI.login()` from the auth API service
- **Benefits**: 
  - Proper token management through interceptors
  - Automatic token refresh on 401 errors
  - Consistent error handling
  - Request/response logging in development

### 2. **RegisterTenantPage.jsx**
- **Before**: Used hardcoded `fetch()` with manual timeout handling
- **After**: Now uses `authAPI.register()` from the auth API service
- **Benefits**:
  - Simplified error handling
  - Automatic request timeout management
  - Proper token storage after registration
  - Consistent response format handling

### 3. **RegisterInvestorPage.jsx**
- **Before**: Used hardcoded `fetch()` with manual timeout handling
- **After**: Now uses `authAPI.register()` from the auth API service
- **Benefits**: Same as RegisterTenantPage

### 4. **ForgotPasswordPage.jsx**
- **Before**: Had mock implementation with setTimeout
- **After**: Now uses `authAPI.forgotPassword()` from the auth API service
- **Benefits**:
  - Actual API call to backend
  - Proper error handling
  - Real password reset flow

### 5. **Frontend Environment Configuration**
- **Created**: `.env` file with proper API configuration
- **Content**:
  ```
  VITE_API_BASE_URL=http://localhost:5000/api
  VITE_SOCKET_URL=http://localhost:5000
  VITE_APP_NAME=StaySpot
  VITE_NODE_ENV=development
  ```

## API Service Architecture

### Axios Configuration (`frontend/src/utils/api/axios.js`)
- Base URL: `http://localhost:5000/api`
- Timeout: 30 seconds
- Request interceptors:
  - Adds Authorization header with Bearer token
  - Adds request ID and timestamp headers
  - Logs requests in development mode
- Response interceptors:
  - Standardizes response format
  - Handles token refresh on 401 errors
  - Provides detailed error messages
  - Logs responses in development mode

### Auth API Service (`frontend/src/utils/api/auth.api.js`)
Provides methods:
- `login(credentials)` - User login
- `register(userData)` - User registration
- `logout(allDevices)` - User logout
- `refreshToken()` - Refresh access token
- `forgotPassword(email)` - Request password reset
- `resetPassword(resetData)` - Reset password with token
- `verifyEmail(token)` - Verify email address
- `getProfile()` - Get current user profile
- `updateProfile(profileData)` - Update user profile
- `changePassword(passwordData)` - Change password
- And more...

## Token Management

### Storage
- Access Token: `localStorage.accessToken`
- Refresh Token: `localStorage.refreshToken`
- User Data: `localStorage.user`
- Permissions: `localStorage.permissions`
- Roles: `localStorage.roles`

### Token Refresh Flow
1. Request fails with 401 status
2. Interceptor attempts to refresh token using refresh token
3. New access token is obtained and stored
4. Original request is retried with new token
5. If refresh fails, user is redirected to login

## Communication Flow

```
Frontend Page
    ↓
authAPI.login() / register() / etc.
    ↓
axios instance (with interceptors)
    ↓
Request Interceptor (adds auth token)
    ↓
Backend API (http://localhost:5000/api/auth/...)
    ↓
Response Interceptor (handles errors, token refresh)
    ↓
Frontend receives standardized response
```

## Testing the Integration

### Login Flow
1. Navigate to `http://localhost:3000/auth/login`
2. Enter credentials
3. Click "Sign In"
4. Frontend sends request to `http://localhost:5000/api/auth/login`
5. Backend validates and returns tokens
6. Tokens are stored in localStorage
7. User is redirected to dashboard

### Registration Flow
1. Navigate to `http://localhost:3000/auth/register`
2. Select role (Tenant or Investor)
3. Fill in registration form
4. Click "Create Account"
5. Frontend sends request to `http://localhost:5000/api/auth/register`
6. Backend creates user and returns success
7. User is redirected to login page

### Password Reset Flow
1. Navigate to `http://localhost:3000/auth/forgot-password`
2. Enter email
3. Click "Send Reset Link"
4. Frontend sends request to `http://localhost:5000/api/auth/forgot-password`
5. Backend sends reset email
6. User receives email with reset link
7. User clicks link and resets password

## Environment Setup

### Backend
- Running on `http://localhost:5000`
- Database: MariaDB on `localhost:3306`
- API endpoints: `/api/auth/*`

### Frontend
- Running on `http://localhost:3000`
- Vite dev server with proxy to backend
- Environment variables in `.env`

### Vite Proxy Configuration
The `vite.config.js` includes proxy configuration:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    secure: false,
  },
  '/socket.io': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    ws: true,
  },
}
```

This allows frontend to make requests to `/api/*` which are proxied to the backend.

## Verification Checklist

- [x] LoginPage uses authAPI.login()
- [x] RegisterTenantPage uses authAPI.register()
- [x] RegisterInvestorPage uses authAPI.register()
- [x] ForgotPasswordPage uses authAPI.forgotPassword()
- [x] Environment variables configured in .env
- [x] Axios interceptors properly configured
- [x] Token management implemented
- [x] Error handling standardized
- [x] Request/response logging in development

## Next Steps

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Test login at `http://localhost:3000/auth/login`
4. Test registration at `http://localhost:3000/auth/register`
5. Monitor browser console for request/response logs
6. Check Network tab in DevTools to verify API calls
