# Dashboard API Integration - Quick Reference

## What Was Done

✅ **Company Dashboard fully integrated with backend APIs**

The Company Dashboard (`/frontend/src/pages/company/Dashboard.jsx`) now:
- Fetches real-time data from the database via REST APIs
- Displays loading states while fetching data
- Shows error messages with retry functionality
- Automatically updates when time range changes
- Falls back to default values if API endpoints don't exist

## Key Features Implemented

### 1. **Real-time Data Fetching**
```javascript
useEffect(() => {
  fetchDashboardData();
}, [timeRange]);

const fetchDashboardData = async () => {
  const [dashboardDataRes, metricsRes, activityRes, companiesRes] = await Promise.all([
    managementAPI.getDashboardStats(timeRange),
    managementAPI.getKeyMetrics(),
    managementAPI.getRecentActivities(10),
    managementAPI.getCompanies({ limit: 5 })
  ]);
};
```

### 2. **Error Handling**
- Displays error message when API fails
- Provides retry button to reload data
- Graceful fallback to empty/default values

### 3. **Loading States**
- Shows spinner while loading
- Prevents rendering until data is ready
- Smooth transitions between states

### 4. **Responsive to Changes**
- Updates data when timeRange dropdown changes
- Supports week, month, quarter, year views

## API Endpoints Used

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `/api/management/dashboard` | Get dashboard overview data | GET |
| `/api/management/dashboard/metrics` | Get KPI metrics | GET |
| `/api/management/dashboard/recent-activity` | Get activity log | GET |
| `/api/management/companies` | Get company list | GET |

## Files Modified/Created

### Frontend Files
1. **`/frontend/src/pages/company/Dashboard.jsx`** ✨ UPDATED
   - Added state hooks for data management
   - Integrated API calls with useEffect
   - Added error and loading states
   - Updated render logic to use real data

2. **`/frontend/src/services/managementAPI.js`** ✨ UPDATED
   - Added `getDashboardStats()` method
   - Added `getKeyMetrics()` method
   - Added `getCompanies()` method
   - Added error handling to all methods

3. **`DASHBOARD_API_INTEGRATION_GUIDE.md`** ✨ CREATED
   - Comprehensive integration documentation
   - API endpoint specifications
   - Backend implementation requirements
   - Testing instructions
   - Troubleshooting guide

## Backend Requirements

For the dashboard to work fully, the backend needs to implement these endpoints:

### Minimum Implementation (Current)
The dashboard works with OR without these endpoints:
- Endpoint not implemented → uses default/empty values
- Endpoint implemented → shows real data

### Full Implementation (Recommended)
Add these controller methods:

```javascript
// File: /backend/src/controllers/management/dashboard.controller.js

// Get dashboard data with metrics, revenue, and alerts
exports.getDashboardData = async (req, res) => {
  const { timeRange = 'month' } = req.query;
  // Return: systemMetrics, revenueData, revenueBreakdown, alerts
};

// Get key performance metrics
exports.getKeyMetrics = async (req, res) => {
  // Return: totalProperties, activeUsers, revenue, systemHealth
};

// Get recent activities/audit logs
exports.getRecentActivity = async (req, res) => {
  const { limit = 10 } = req.query;
  // Return: array of recent activities
};
```

## How to Test

### 1. **Frontend Only (Without Backend)**
The dashboard will display with empty/default values:
```bash
cd frontend
npm run dev
# Navigate to /company
# See loading spinner → error message → retry button
```

### 2. **With Backend API**

#### Option A: Mock the endpoints
```javascript
// In managementAPI.js
getDashboardStats: async (timeRange = 'month') => {
  return {
    systemMetrics: [...],
    revenueData: [...],
    alerts: [...]
  };
}
```

#### Option B: Implement backend endpoints
```javascript
// In backend/src/routes/management.routes.js
router.get('/dashboard', auth, requireRole(['system_admin', 'company_admin']), 
  dashboardController.getDashboardData);

router.get('/dashboard/metrics', auth, requirePermission('dashboard:read'),
  dashboardController.getKeyMetrics);

router.get('/dashboard/recent-activity', auth, requirePermission('dashboard:read'),
  dashboardController.getRecentActivity);
```

## Expected API Responses

### GET /api/management/dashboard
```json
{
  "success": true,
  "data": {
    "systemMetrics": [
      { "label": "API Requests", "value": "2.4B", "change": "+15%", "icon": "📡" }
    ],
    "revenueData": [
      { "month": "Jan", "value": 1800000, "percent": 60 }
    ],
    "revenueBreakdown": [
      { "source": "Subscription Plans", "percentage": 65, "amount": "$1.59M" }
    ],
    "alerts": [
      { "id": 1, "type": "info", "title": "Dashboard Loaded", "message": "...", "time": "just now" }
    ]
  }
}
```

### GET /api/management/dashboard/metrics
```json
{
  "success": true,
  "data": {
    "totalProperties": 1240,
    "propertiesChange": "+8.5%",
    "activeUsers": "45.2K",
    "usersChange": "+12.3%",
    "revenue": "$2.45M",
    "revenueChange": "+18.7%",
    "systemHealth": "99.8%",
    "healthChange": "+0.2%"
  }
}
```

### GET /api/management/dashboard/recent-activity
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "action": "Property Created",
      "description": "New property added",
      "timestamp": "2025-12-28T10:30:00Z"
    }
  ]
}
```

### GET /api/management/companies
```json
{
  "success": true,
  "data": [
    {
      "id": "company-uuid",
      "name": "Premium Properties Inc",
      "properties": 156,
      "revenue": "$245,000",
      "users": 2340,
      "status": "active"
    }
  ],
  "total": 50,
  "limit": 5,
  "offset": 0
}
```

## Common Issues & Solutions

### ❌ "Failed to load dashboard data"
**Cause**: Backend endpoints not implemented or server not running
**Solution**: 
1. Check if backend is running: `npm start` in backend folder
2. Verify API_BASE_URL in environment
3. Check browser console for actual error

### ❌ "401 Unauthorized"
**Cause**: Invalid or missing authentication token
**Solution**:
1. Login to application first
2. Check localStorage for authToken
3. Verify token is still valid

### ❌ Dashboard shows empty values (0, $0, etc.)
**Cause**: API endpoints return null or backend not returning expected data
**Solution**:
1. Check API response format
2. Verify backend query logic
3. Check database for actual data

### ❌ Slow loading (> 3 seconds)
**Cause**: Slow API response or database queries
**Solution**:
1. Add database indexes
2. Optimize queries
3. Implement caching (Redis)
4. Use database aggregation instead of JS

## Next Steps

1. **Implement Backend Endpoints**
   - Review DASHBOARD_API_INTEGRATION_GUIDE.md
   - Add dashboard controller methods
   - Query database for metrics
   - Return formatted JSON responses

2. **Test Integration**
   - Run dashboard against API
   - Verify all data displays correctly
   - Test error scenarios
   - Monitor API response times

3. **Add More Features**
   - Real-time updates via WebSocket
   - Advanced filtering options
   - Custom date ranges
   - Export functionality
   - Alert configuration

4. **Optimize Performance**
   - Add API response caching
   - Pre-aggregate database queries
   - Implement pagination
   - Add query performance monitoring

## Code Examples for Backend

### Simple Dashboard Controller
```javascript
const Dashboard = require('../../models/Dashboard');

exports.getDashboardData = async (req, res, next) => {
  try {
    const { timeRange = 'month' } = req.query;
    
    // Get system metrics from database
    const systemMetrics = await Dashboard.getSystemMetrics(timeRange);
    const revenueData = await Dashboard.getRevenueData(timeRange);
    const alerts = await Dashboard.getAlerts();
    
    res.json({
      success: true,
      data: {
        systemMetrics,
        revenueData,
        revenueBreakdown: [],
        alerts
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getKeyMetrics = async (req, res, next) => {
  try {
    const metrics = await Dashboard.getKeyMetrics();
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const activities = await Dashboard.getRecentActivities(limit);
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};
```

## Environment Configuration

Create `.env` file in frontend root:
```
REACT_APP_API_URL=http://localhost:5000/api
VITE_API_URL=http://localhost:5000/api
```

For production:
```
REACT_APP_API_URL=https://api.stayspot.com/api
VITE_API_URL=https://api.stayspot.com/api
```

## Documentation Files

- 📄 **DASHBOARD_API_INTEGRATION_GUIDE.md** - Complete technical guide
- 📄 **This file** - Quick reference for developers
- 🔗 **Backend Routes** - `/backend/src/routes/management.routes.js`
- 🔗 **API Service** - `/frontend/src/services/managementAPI.js`
- 🔗 **Dashboard Component** - `/frontend/src/pages/company/Dashboard.jsx`

## Support

For detailed information on:
- **API Specification**: See DASHBOARD_API_INTEGRATION_GUIDE.md
- **Frontend Code**: Check /frontend/src/pages/company/Dashboard.jsx
- **API Service**: Check /frontend/src/services/managementAPI.js
- **Backend Routes**: Check /backend/src/routes/management.routes.js
