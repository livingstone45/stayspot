# Backend-Frontend API Mapping

## Architecture Overview

```
Frontend (React + Vite)          Backend (Express + Node.js)
├── src/utils/api/               ├── src/routes/
│   ├── auth.api.js              │   ├── auth.routes.js
│   ├── property.api.js          │   ├── property.routes.js
│   ├── tenant.api.js            │   ├── tenant.routes.js
│   ├── management.api.js        │   ├── management.routes.js
│   ├── maintenance.api.js       │   ├── maintenance.routes.js
│   ├── financial.api.js         │   ├── financial.routes.js
│   ├── system.api.js            │   ├── system.routes.js
│   └── axios.js                 │   ├── task.routes.js
│                                │   ├── user.routes.js
├── src/pages/auth/              │   ├── communication.routes.js
│   ├── LoginPage.jsx            │   └── integration.routes.js
│   ├── RegisterTenantPage.jsx   │
│   ├── RegisterInvestorPage.jsx │
│   └── ForgotPasswordPage.jsx   │
│                                │
└── src/pages/                   └── src/controllers/
    ├── tenant/                      ├── auth/
    ├── landlord/                    ├── property/
    ├── management/                  ├── tenant/
    └── admin/                       ├── management/
                                     ├── maintenance/
                                     ├── financial/
                                     └── system/
```

## API Endpoints Mapping

### Authentication Routes
| Frontend | Backend Route | Method | Purpose |
|----------|---------------|--------|---------|
| `authAPI.login()` | `/api/auth/login` | POST | User login |
| `authAPI.register()` | `/api/auth/register` | POST | User registration |
| `authAPI.logout()` | `/api/auth/logout` | POST | User logout |
| `authAPI.refreshToken()` | `/api/auth/refresh` | POST | Refresh access token |
| `authAPI.forgotPassword()` | `/api/auth/forgot-password` | POST | Request password reset |
| `authAPI.resetPassword()` | `/api/auth/reset-password` | POST | Reset password |
| `authAPI.verifyEmail()` | `/api/auth/verify-email` | POST | Verify email |
| `authAPI.getProfile()` | `/api/auth/profile` | GET | Get user profile |
| `authAPI.updateProfile()` | `/api/auth/profile` | PUT | Update user profile |
| `authAPI.changePassword()` | `/api/auth/change-password` | POST | Change password |

### Property Routes
| Frontend | Backend Route | Method | Purpose |
|----------|---------------|--------|---------|
| `propertyAPI.getProperties()` | `/api/properties` | GET | List all properties |
| `propertyAPI.getProperty()` | `/api/properties/:id` | GET | Get property details |
| `propertyAPI.createProperty()` | `/api/properties` | POST | Create new property |
| `propertyAPI.updateProperty()` | `/api/properties/:id` | PUT | Update property |
| `propertyAPI.deleteProperty()` | `/api/properties/:id` | DELETE | Delete property |
| `propertyAPI.uploadImages()` | `/api/properties/:id/images` | POST | Upload property images |

### Tenant Routes
| Frontend | Backend Route | Method | Purpose |
|----------|---------------|--------|---------|
| `tenantAPI.getTenants()` | `/api/tenants` | GET | List tenants |
| `tenantAPI.getTenant()` | `/api/tenants/:id` | GET | Get tenant details |
| `tenantAPI.createTenant()` | `/api/tenants` | POST | Create tenant |
| `tenantAPI.updateTenant()` | `/api/tenants/:id` | PUT | Update tenant |
| `tenantAPI.deleteTenant()` | `/api/tenants/:id` | DELETE | Delete tenant |
| `tenantAPI.getApplications()` | `/api/tenants/applications` | GET | Get applications |

### Management Routes
| Frontend | Backend Route | Method | Purpose |
|----------|---------------|--------|---------|
| `managementAPI.getDashboard()` | `/api/management/dashboard` | GET | Get dashboard data |
| `managementAPI.getStats()` | `/api/management/stats` | GET | Get statistics |
| `managementAPI.getReports()` | `/api/management/reports` | GET | Get reports |

### Maintenance Routes
| Frontend | Backend Route | Method | Purpose |
|----------|---------------|--------|---------|
| `maintenanceAPI.getRequests()` | `/api/maintenance/requests` | GET | List maintenance requests |
| `maintenanceAPI.createRequest()` | `/api/maintenance/requests` | POST | Create maintenance request |
| `maintenanceAPI.updateRequest()` | `/api/maintenance/requests/:id` | PUT | Update request |
| `maintenanceAPI.assignTechnician()` | `/api/maintenance/requests/:id/assign` | POST | Assign technician |

### Financial Routes
| Frontend | Backend Route | Method | Purpose |
|----------|---------------|--------|---------|
| `financialAPI.getTransactions()` | `/api/financial/transactions` | GET | List transactions |
| `financialAPI.getInvoices()` | `/api/financial/invoices` | GET | List invoices |
| `financialAPI.createInvoice()` | `/api/financial/invoices` | POST | Create invoice |
| `financialAPI.getPayments()` | `/api/financial/payments` | GET | List payments |

### Task Routes
| Backend Route | Method | Purpose |
|---------------|--------|---------|
| `/api/tasks` | GET | List tasks |
| `/api/tasks` | POST | Create task |
| `/api/tasks/:id` | PUT | Update task |
| `/api/tasks/:id` | DELETE | Delete task |

### User Routes
| Backend Route | Method | Purpose |
|---------------|--------|---------|
| `/api/users` | GET | List users |
| `/api/users/:id` | GET | Get user details |
| `/api/users/:id` | PUT | Update user |
| `/api/users/:id` | DELETE | Delete user |

## Communication Flow

### Login Flow
```
LoginPage.jsx
    ↓
authAPI.login(credentials)
    ↓
axios.post('/api/auth/login', credentials)
    ↓
Request Interceptor (adds auth token)
    ↓
Backend: POST /api/auth/login
    ↓
auth.controller.login()
    ↓
Database: Query user
    ↓
Response: { user, accessToken, refreshToken }
    ↓
Response Interceptor (standardizes format)
    ↓
localStorage.setItem('accessToken', token)
    ↓
Redirect to dashboard
```

### API Request Flow
```
Frontend Component
    ↓
API Service (e.g., propertyAPI.getProperties())
    ↓
axios instance (baseURL: http://localhost:5000/api)
    ↓
Request Interceptor
  - Add Authorization header
  - Add request ID
  - Log request (dev mode)
    ↓
HTTP Request to Backend
    ↓
Backend Route Handler
    ↓
Controller Logic
    ↓
Database Query
    ↓
HTTP Response
    ↓
Response Interceptor
  - Standardize format
  - Handle errors
  - Refresh token if 401
    ↓
Frontend receives data
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
JWT_SECRET=your_jwt_secret
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

## Socket.IO Connection

### Backend (server.js)
```javascript
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
```

### Frontend (socket connection)
```javascript
import io from 'socket.io-client'
const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
})
```

## File Structure Summary

### Backend Structure
```
backend/
├── src/
│   ├── controllers/        # Business logic
│   ├── routes/            # API endpoints
│   ├── models/            # Database models
│   ├── middleware/        # Auth, validation, error handling
│   ├── services/          # External services (email, storage)
│   ├── socket/            # WebSocket handlers
│   ├── workers/           # Background jobs
│   ├── utils/             # Utilities and helpers
│   ├── config/            # Configuration files
│   ├── database.js        # Database setup
│   └── server.js          # Express server setup
├── package.json
└── .env
```

### Frontend Structure
```
frontend/
├── src/
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── utils/
│   │   └── api/          # API services
│   ├── store/            # State management (Zustand)
│   ├── hooks/            # Custom React hooks
│   ├── routes/           # Route definitions
│   ├── layouts/          # Layout components
│   ├── contexts/         # React contexts
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── .env
```

## Key Integration Points

### 1. Authentication
- Frontend: `LoginPage.jsx` → `authAPI.login()`
- Backend: `POST /api/auth/login` → `auth.controller.login()`
- Storage: Tokens in localStorage, user data in state

### 2. Data Fetching
- Frontend: Component → API Service → axios
- Backend: Route → Controller → Model → Database
- Response: Standardized format with success/error

### 3. Real-time Updates
- Frontend: Socket.IO client connection
- Backend: Socket.IO server with handlers
- Events: Property updates, notifications, chat

### 4. Error Handling
- Frontend: Axios interceptors catch errors
- Backend: Global error handler middleware
- User: Toast notifications for errors

## Testing the Connection

### 1. Check Backend Running
```bash
curl http://localhost:5000/health
```

### 2. Check Frontend Running
```bash
curl http://localhost:3000
```

### 3. Test API Call
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 4. Check Network Tab
- Open DevTools → Network tab
- Perform login
- Verify requests go to `http://localhost:5000/api/auth/login`
- Check response format

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS error | Frontend URL not in backend CORS | Update `FRONTEND_URL` in backend .env |
| 401 Unauthorized | Token expired | Implement token refresh in interceptor |
| Network error | Backend not running | Start backend: `npm run dev` |
| API timeout | Slow response | Increase `VITE_API_TIMEOUT` |
| Socket connection failed | Socket.IO not initialized | Check `initializeSocket()` in server.js |

## Deployment Checklist

- [ ] Backend environment variables configured
- [ ] Frontend environment variables configured
- [ ] Database migrations run
- [ ] CORS origins updated for production
- [ ] JWT secrets configured
- [ ] Email service configured
- [ ] File upload paths configured
- [ ] Socket.IO CORS updated
- [ ] Frontend built: `npm run build`
- [ ] Backend started: `npm start`
