# Backend-Frontend Connection Diagram

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React + Vite)                            │
│                        http://localhost:3000                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        React Components                              │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────────┐ │  │
│  │  │  LoginPage.jsx  │  │ PropertyList.jsx │  │ DashboardPage.jsx   │ │  │
│  │  └────────┬────────┘  └────────┬─────────┘  └────────┬────────────┘ │  │
│  │           │                    │                     │              │  │
│  │           └────────────────────┼─────────────────────┘              │  │
│  │                                │                                    │  │
│  │                    ┌───────────▼──────────────┐                    │  │
│  │                    │   API Service Layer      │                    │  │
│  │                    │  ┌────────────────────┐  │                    │  │
│  │                    │  │  authAPI.login()   │  │                    │  │
│  │                    │  │  propertyAPI.get() │  │                    │  │
│  │                    │  │  tenantAPI.list()  │  │                    │  │
│  │                    │  └────────────────────┘  │                    │  │
│  │                    └───────────┬──────────────┘                    │  │
│  │                                │                                    │  │
│  │                    ┌───────────▼──────────────┐                    │  │
│  │                    │   Axios Instance         │                    │  │
│  │                    │  baseURL: /api           │                    │  │
│  │                    │  timeout: 30000ms        │                    │  │
│  │                    └───────────┬──────────────┘                    │  │
│  │                                │                                    │  │
│  │                    ┌───────────▼──────────────┐                    │  │
│  │                    │  Request Interceptor     │                    │  │
│  │                    │  - Add Auth Token        │                    │  │
│  │                    │  - Add Request ID        │                    │  │
│  │                    │  - Log Request (dev)     │                    │  │
│  │                    └───────────┬──────────────┘                    │  │
│  │                                │                                    │  │
│  └────────────────────────────────┼────────────────────────────────────┘  │
│                                   │                                        │
│                    HTTP/HTTPS Request                                      │
│                    POST /api/auth/login                                    │
│                    GET /api/properties                                     │
│                    PUT /api/properties/:id                                 │
│                                   │                                        │
└───────────────────────────────────┼────────────────────────────────────────┘
                                    │
                                    │ CORS Enabled
                                    │ Origin: http://localhost:3000
                                    │
┌───────────────────────────────────▼────────────────────────────────────────┐
│                         BACKEND (Express + Node.js)                        │
│                        http://localhost:5000                               │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                      Express Server                                  │ │
│  │  ┌────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    Route Handlers                              │ │ │
│  │  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐  │ │ │
│  │  │  │ POST /auth/login │  │ GET /properties  │  │ PUT /tasks │  │ │ │
│  │  │  └────────┬─────────┘  └────────┬─────────┘  └─────┬──────┘  │ │ │
│  │  │           │                     │                  │         │ │ │
│  │  │           └─────────────────────┼──────────────────┘         │ │ │
│  │  │                                 │                            │ │ │
│  │  │                    ┌────────────▼────────────┐               │ │ │
│  │  │                    │  Controllers            │               │ │ │
│  │  │                    │  ┌──────────────────┐   │               │ │ │
│  │  │                    │  │ auth.controller  │   │               │ │ │
│  │  │                    │  │ property.ctrl    │   │               │ │ │
│  │  │                    │  │ task.controller  │   │               │ │ │
│  │  │                    │  └──────────────────┘   │               │ │ │
│  │  │                    └────────────┬────────────┘               │ │ │
│  │  │                                 │                            │ │ │
│  │  │                    ┌────────────▼────────────┐               │ │ │
│  │  │                    │  Middleware             │               │ │ │
│  │  │                    │  - Auth Verification   │               │ │ │
│  │  │                    │  - Input Validation    │               │ │ │
│  │  │                    │  - Error Handling      │               │ │ │
│  │  │                    │  - Rate Limiting       │               │ │ │
│  │  │                    └────────────┬────────────┘               │ │ │
│  │  │                                 │                            │ │ │
│  │  │                    ┌────────────▼────────────┐               │ │ │
│  │  │                    │  Models (Sequelize)    │               │ │ │
│  │  │                    │  - User                │               │ │ │
│  │  │                    │  - Property            │               │ │ │
│  │  │                    │  - Task                │               │ │ │
│  │  │                    │  - Tenant              │               │ │ │
│  │  │                    └────────────┬────────────┘               │ │ │
│  │  │                                 │                            │ │ │
│  │  └─────────────────────────────────┼────────────────────────────┘ │ │
│  │                                    │                              │ │
│  │                    ┌───────────────▼──────────────┐               │ │
│  │                    │   Database Connection       │               │ │
│  │                    │   MySQL/MariaDB             │               │ │
│  │                    │   localhost:3306            │               │ │
│  │                    │   stayspot_db               │               │ │
│  │                    └────────────────────────────┘               │ │
│  │                                                                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    Socket.IO Server                              │ │
│  │  - Real-time notifications                                       │ │
│  │  - Live property updates                                         │ │
│  │  - Chat messaging                                                │ │
│  │  - Connection: ws://localhost:5000                               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Request-Response Flow

### Authentication Flow
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. User enters credentials in LoginPage.jsx                             │
│    email: "user@example.com"                                            │
│    password: "SecurePass123!"                                           │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│ 2. authAPI.login(credentials) called                                    │
│    - Validates input                                                    │
│    - Adds device info                                                   │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│ 3. axios.post('/api/auth/login', credentials)                           │
│    - Request Interceptor adds Authorization header                      │
│    - Adds X-Request-ID and X-Request-Time headers                       │
│    - Logs request in development mode                                   │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
                    HTTP POST
                    http://localhost:5000/api/auth/login
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│ 4. Backend receives request                                             │
│    - CORS middleware validates origin                                   │
│    - Rate limiter checks request count                                  │
│    - Validation middleware checks input format                          │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│ 5. auth.controller.login() executes                                     │
│    - Finds user in database                                             │
│    - Compares password hash                                             │
│    - Generates JWT tokens                                               │
│    - Creates audit log                                                  │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│ 6. Response sent to frontend                                            │
│    {                                                                    │
│      success: true,                                                     │
│      data: {                                                            │
│        user: { id, email, firstName, lastName, roles },                │
│        tokens: {                                                        │
│          accessToken: "eyJhbGc...",                                    │
│          refreshToken: "eyJhbGc...",                                   │
│          expiresIn: "1h"                                                │
│        }                                                                │
│      }                                                                  │
│    }                                                                    │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│ 7. Response Interceptor processes response                              │
│    - Standardizes response format                                       │
│    - Logs response in development mode                                  │
│    - Returns data to component                                          │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│ 8. Frontend stores tokens and user data                                 │
│    - localStorage.setItem('accessToken', token)                         │
│    - localStorage.setItem('user', userData)                             │
│    - Update state/store                                                 │
└────────────────────────┬────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────────────┐
│ 9. Redirect to dashboard                                                │
│    navigate('/tenant/dashboard')                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## API Endpoint Connections

### Auth Endpoints
```
Frontend                          Backend
─────────────────────────────────────────────────────────────
authAPI.login()          ──────→  POST /api/auth/login
authAPI.register()       ──────→  POST /api/auth/register
authAPI.logout()         ──────→  POST /api/auth/logout
authAPI.refreshToken()   ──────→  POST /api/auth/refresh
authAPI.forgotPassword() ──────→  POST /api/auth/forgot-password
authAPI.resetPassword()  ──────→  POST /api/auth/reset-password
authAPI.verifyEmail()    ──────→  POST /api/auth/verify-email
authAPI.getProfile()     ──────→  GET /api/auth/profile
authAPI.updateProfile()  ──────→  PUT /api/auth/profile
authAPI.changePassword() ──────→  POST /api/auth/change-password
```

### Property Endpoints
```
Frontend                          Backend
─────────────────────────────────────────────────────────────
propertyAPI.getProperties()  ──→  GET /api/properties
propertyAPI.getProperty()    ──→  GET /api/properties/:id
propertyAPI.createProperty() ──→  POST /api/properties
propertyAPI.updateProperty() ──→  PUT /api/properties/:id
propertyAPI.deleteProperty() ──→  DELETE /api/properties/:id
propertyAPI.uploadImages()   ──→  POST /api/properties/:id/images
propertyAPI.getUnits()       ──→  GET /api/properties/:id/units
propertyAPI.createUnit()     ──→  POST /api/properties/:id/units
propertyAPI.updateUnit()     ──→  PUT /api/properties/:id/units/:unitId
propertyAPI.deleteUnit()     ──→  DELETE /api/properties/:id/units/:unitId
```

### Tenant Endpoints
```
Frontend                          Backend
─────────────────────────────────────────────────────────────
tenantAPI.getTenants()   ──────→  GET /api/tenants
tenantAPI.getTenant()    ──────→  GET /api/tenants/:id
tenantAPI.createTenant() ──────→  POST /api/tenants
tenantAPI.updateTenant() ──────→  PUT /api/tenants/:id
tenantAPI.deleteTenant() ──────→  DELETE /api/tenants/:id
```

## Data Flow Example: Create Property

```
User fills property form
        │
        ▼
propertyAPI.createProperty(data, images)
        │
        ▼
axios.post('/api/properties', formData)
        │
        ├─ Request Interceptor
        │  ├─ Add Authorization header
        │  ├─ Add X-Request-ID
        │  └─ Log request
        │
        ▼
HTTP POST to http://localhost:5000/api/properties
        │
        ├─ CORS Middleware (validate origin)
        ├─ Rate Limiter (check limits)
        ├─ Auth Middleware (verify token)
        ├─ Validation Middleware (validate input)
        │
        ▼
property.controller.createProperty()
        │
        ├─ Validate property data
        ├─ Create Property model instance
        ├─ Save to database
        ├─ Process images
        ├─ Create audit log
        │
        ▼
Response: { success: true, data: { id, name, ... } }
        │
        ├─ Response Interceptor
        │  ├─ Standardize format
        │  ├─ Log response
        │  └─ Handle errors
        │
        ▼
Frontend receives data
        │
        ├─ Update state
        ├─ Show success toast
        ├─ Redirect to property details
        │
        ▼
User sees new property
```

## Environment Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=stayspot_db
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key
JWT_ACCESS_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
VITE_SOCKET_URL=http://localhost:5000
VITE_SOCKET_TIMEOUT=5000
VITE_APP_NAME=StaySpot
VITE_NODE_ENV=development
```

## Error Handling Flow

```
Frontend Request
        │
        ▼
Backend Response (Error)
        │
        ├─ 400: Bad Request
        │  └─ Response Interceptor catches
        │     └─ Shows validation error toast
        │
        ├─ 401: Unauthorized
        │  └─ Response Interceptor catches
        │     ├─ Attempts token refresh
        │     ├─ If refresh fails
        │     │  └─ Clears tokens
        │     │  └─ Redirects to login
        │     └─ If refresh succeeds
        │        └─ Retries original request
        │
        ├─ 403: Forbidden
        │  └─ Shows permission error toast
        │
        ├─ 404: Not Found
        │  └─ Shows not found error toast
        │
        ├─ 500: Server Error
        │  └─ Shows server error toast
        │
        └─ Network Error
           └─ Shows connection error toast
```

## Socket.IO Real-time Connection

```
Frontend                          Backend
─────────────────────────────────────────────────────────────
socket.io-client          ──────→  Socket.IO Server
  │                                  │
  ├─ connect event        ──────→  connection handler
  ├─ property:update      ──────→  property update handler
  ├─ notification:new     ──────→  notification handler
  ├─ chat:message         ──────→  chat handler
  │
  ←────────────────────────────  broadcast events
  │
  ├─ property:updated
  ├─ notification:received
  ├─ chat:message:received
  │
  └─ disconnect event     ──────→  cleanup handler
```

## Summary

- **Frontend**: React + Vite on port 3000
- **Backend**: Express + Node.js on port 5000
- **Database**: MySQL/MariaDB on port 3306
- **Communication**: HTTP/HTTPS + WebSocket
- **Authentication**: JWT tokens in localStorage
- **Error Handling**: Axios interceptors + Global error handler
- **Real-time**: Socket.IO for live updates
