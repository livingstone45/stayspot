# Dashboard API Integration Guide

## Overview
The Company Dashboard has been fully integrated with the StaySpot backend API to fetch real-time data from the database. This document outlines the integration architecture and API endpoints used.

## Architecture

### Frontend Components
- **File**: `/frontend/src/pages/company/Dashboard.jsx`
- **Type**: React functional component with hooks
- **State Management**: React `useState` and `useEffect` hooks
- **API Service**: `managementAPI` from `/frontend/src/services/managementAPI.js`

### Backend API Endpoints
All endpoints are protected with authentication and role-based access control.

#### Dashboard Endpoints

##### 1. Get Dashboard Data
**Endpoint**: `GET /api/management/dashboard`
**Authentication**: Required (Bearer token)
**Role Required**: `company_admin` or `system_admin`
**Query Parameters**:
- `timeRange` (optional): 'week', 'month', 'quarter', 'year' - defaults to 'month'

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "systemMetrics": [
      {
        "label": "API Requests",
        "value": "2.4B",
        "change": "+15%",
        "icon": "📡"
      }
    ],
    "revenueData": [
      {
        "month": "Jan",
        "value": 1800000,
        "percent": 60
      }
    ],
    "revenueBreakdown": [
      {
        "source": "Subscription Plans",
        "percentage": 65,
        "amount": "$1.59M"
      }
    ],
    "alerts": [
      {
        "id": 1,
        "type": "critical",
        "title": "High API Usage",
        "message": "3 companies exceeding rate limits",
        "time": "5 min ago"
      }
    ]
  }
}
```

##### 2. Get Key Metrics
**Endpoint**: `GET /api/management/dashboard/metrics`
**Authentication**: Required (Bearer token)
**Role Required**: `dashboard:read` permission

**Response Structure**:
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

##### 3. Get Recent Activity
**Endpoint**: `GET /api/management/dashboard/recent-activity`
**Authentication**: Required (Bearer token)
**Role Required**: `dashboard:read` permission
**Query Parameters**:
- `limit` (optional): Number of activities to return - defaults to 10

**Response Structure**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "action": "Property Created",
      "description": "New property added to portfolio",
      "timestamp": "2025-12-28T10:30:00Z",
      "userId": "user-uuid",
      "userName": "John Doe"
    }
  ]
}
```

##### 4. Get Companies
**Endpoint**: `GET /api/management/companies`
**Authentication**: Required (Bearer token)
**Role Required**: `system_admin`
**Query Parameters**:
- `status` (optional): 'active', 'inactive', 'suspended'
- `search` (optional): Search term for company name
- `limit` (optional): Number of records to return
- `offset` (optional): Pagination offset

**Response Structure**:
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

## Frontend Implementation

### Component Structure

```jsx
// State hooks
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [dashboardData, setDashboardData] = useState(null);
const [metrics, setMetrics] = useState(null);
const [recentActivity, setRecentActivity] = useState([]);
const [companies, setCompanies] = useState([]);

// Effect hook to fetch data
useEffect(() => {
  fetchDashboardData();
}, [timeRange]);

// Fetch function
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    const [dashboardDataRes, metricsRes, activityRes, companiesRes] = await Promise.all([
      managementAPI.getDashboardStats(timeRange),
      managementAPI.getKeyMetrics(),
      managementAPI.getRecentActivities(10),
      managementAPI.getCompanies({ limit: 5 })
    ]);
    
    // Process and set state
  } catch (err) {
    setError('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};
```

### Error Handling

The dashboard implements graceful error handling:
1. **Loading State**: Shows spinner while fetching data
2. **Error State**: Displays error message with retry button
3. **Fallback Values**: Uses default/empty values if API returns no data
4. **Request Timeouts**: Handled by axios interceptor (configurable)

### Data Refresh

- Data is fetched on component mount
- Data refreshes when `timeRange` parameter changes
- Manual refresh available via retry button on error state

## API Service Configuration

### File: `/frontend/src/services/managementAPI.js`

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Available Methods

#### Dashboard Methods
- `getDashboardStats(timeRange)` - Get dashboard overview data
- `getKeyMetrics()` - Get key performance metrics
- `getRecentActivities(limit)` - Get recent system activities

#### Company Methods
- `getCompanies(filters)` - List all companies with pagination
- `getCompanyById(id)` - Get single company details
- `createCompany(data)` - Create new company
- `updateCompany(id, data)` - Update company
- `deleteCompany(id)` - Delete company

#### Other Methods
- `getProperties(filters)` - Get property listings
- `getPropertyById(id)` - Get property details
- `createProperty(data)` - Create property
- `updateProperty(id, data)` - Update property
- `deleteProperty(id)` - Delete property
- `getTasks(filters)` - Get task listings
- `getMaintenance(filters)` - Get maintenance requests
- `getAnalytics(timeRange)` - Get analytics data
- `exportData(type, format)` - Export data as CSV/PDF

## Environment Configuration

### Required Environment Variables

Create `.env` file in frontend root:
```
REACT_APP_API_URL=http://localhost:5000/api
```

For production:
```
REACT_APP_API_URL=https://api.stayspot.com/api
```

## Backend Implementation Requirements

### Controller: `system.controller.js` or `dashboard.controller.js`

```javascript
// Get dashboard data
exports.getDashboardData = async (req, res) => {
  const { timeRange = 'month' } = req.query;
  // Query database for metrics
  // Return aggregated data
};

// Get key metrics
exports.getKeyMetrics = async (req, res) => {
  // Query database for KPIs
  // Return formatted metrics
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  const { limit = 10 } = req.query;
  // Query audit logs
  // Return recent activities
};
```

### Database Queries Needed

The backend should implement queries for:
1. **Total Properties**: Count of all properties in system
2. **Active Users**: Count of users with recent activity
3. **Platform Revenue**: Sum of all transactions in period
4. **System Health**: Uptime percentage and performance metrics
5. **Recent Activity**: Audit log entries ordered by timestamp
6. **Top Companies**: Companies ordered by revenue/properties
7. **System Alerts**: Critical and warning level events
8. **Revenue Breakdown**: Revenue by source (subscriptions, premium, etc.)

### Sample Backend Query

```javascript
// Get metrics
const metrics = await Promise.all([
  db.query(`SELECT COUNT(*) as total FROM properties WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH)`),
  db.query(`SELECT COUNT(DISTINCT id) as total FROM users WHERE last_activity > DATE_SUB(NOW(), INTERVAL 7 DAY)`),
  db.query(`SELECT SUM(amount) as total FROM transactions WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH)`),
  db.query(`SELECT uptime FROM system_metrics ORDER BY created_at DESC LIMIT 1`)
]);
```

## Testing

### Manual Testing Steps

1. **Load Dashboard**
   - Navigate to `/company` route
   - Verify loading spinner appears
   - Verify data loads within 2-3 seconds

2. **Change Time Range**
   - Select different time ranges (week, month, quarter, year)
   - Verify dashboard data updates
   - Verify API calls are made with correct parameters

3. **Error Handling**
   - Disconnect API
   - Verify error message displays
   - Click retry button
   - Verify data reloads

4. **Data Validation**
   - Inspect API responses in browser DevTools
   - Verify data matches expected format
   - Check for any console errors

### API Testing Tools

Use curl or Postman to test endpoints:

```bash
# Test dashboard endpoint
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/management/dashboard?timeRange=month

# Test metrics endpoint
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/management/dashboard/metrics

# Test companies endpoint
curl -H "Authorization: Bearer {token}" \
  http://localhost:5000/api/management/companies?limit=5
```

## Performance Optimization

### Current Implementation
- Parallel API requests using `Promise.all()`
- Only fetches top 5 companies (limit configurable)
- Only fetches last 10 activities (limit configurable)

### Future Improvements
1. **Caching**: Implement Redis caching for metrics
2. **Pagination**: Add pagination to activity list
3. **WebSocket**: Real-time updates for alerts
4. **Data Aggregation**: Pre-aggregate metrics at backend
5. **Rate Limiting**: Implement rate limiting on API calls

## Troubleshooting

### Dashboard Shows "Failed to load dashboard data"
**Solutions**:
1. Check API_BASE_URL environment variable
2. Verify backend server is running
3. Check authentication token in localStorage
4. Review browser console for detailed error messages
5. Check CORS configuration on backend

### API Returns 401 Unauthorized
**Solutions**:
1. Verify authentication token is valid
2. Check token expiration
3. Refresh authentication
4. Check user role/permissions

### API Returns 403 Forbidden
**Solutions**:
1. Verify user has required role (company_admin, system_admin)
2. Check permission assignments in database
3. Verify JWT payload contains correct roles

### Data Not Updating
**Solutions**:
1. Check API response data format
2. Verify state setters are being called
3. Check useEffect dependencies
4. Manually trigger refresh with retry button

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live metrics
2. **Advanced Filtering**: More granular date range and category filters
3. **Custom Reports**: User-defined metrics and charts
4. **Data Export**: Export dashboard data as PDF/Excel
5. **Scheduled Reports**: Email reports of key metrics
6. **Alert Management**: Configure alert thresholds
7. **Performance Analytics**: Track API response times
8. **User Activity Timeline**: Detailed activity tracking per user

## API Documentation References

- Backend Routes: `/backend/src/routes/management.routes.js`
- Backend Routes: `/backend/src/routes/system.routes.js`
- API Service: `/frontend/src/services/managementAPI.js`
- Dashboard Component: `/frontend/src/pages/company/Dashboard.jsx`
