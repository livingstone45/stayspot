# 🔌 MANAGEMENT DASHBOARD - BACKEND API INTEGRATION GUIDE

## Quick Start

The management dashboard is ready to connect to your backend. Replace mock data with real API calls by implementing these endpoints.

---

## 📋 Required API Endpoints

### 1. Dashboard Overview

#### Get Dashboard Statistics
```
GET /api/management/dashboard/stats
Query Parameters:
  - timeRange: 'week' | 'month' | 'quarter' | 'year'

Response:
{
  "totalProperties": 48,
  "occupiedProperties": 42,
  "vacancyRate": 8.9,
  "totalRevenue": 125000,
  "pendingTasks": 12,
  "activeMaintenance": 8,
  "collectionRate": 98.5,
  "tenantSatisfaction": 4.7
}
```

#### Get Dashboard Charts Data
```
GET /api/management/dashboard/charts
Query Parameters:
  - timeRange: 'week' | 'month' | 'quarter' | 'year'

Response:
{
  "monthlyRevenue": [
    { "month": "Jan", "revenue": 125000, "expenses": 85000 },
    ...
  ],
  "occupancyTrend": [
    { "month": "Jan", "occupancy": 91.5 },
    ...
  ],
  "propertyStatus": [
    { "name": "Occupied", "value": 42, "color": "#10b981" },
    { "name": "Vacant", "value": 6, "color": "#f59e0b" },
    { "name": "Maintenance", "value": 2, "color": "#ef4444" }
  ],
  "taskStatus": [
    { "name": "Completed", "value": 45, "color": "#10b981" },
    { "name": "In Progress", "value": 23, "color": "#3b82f6" },
    { "name": "Pending", "value": 12, "color": "#f59e0b" }
  ],
  "maintenancePriority": [
    { "name": "Emergency", "value": 3, "color": "#ef4444" },
    { "name": "Urgent", "value": 7, "color": "#f97316" },
    { "name": "Routine", "value": 15, "color": "#10b981" }
  ],
  "recentActivities": [
    {
      "id": 1,
      "type": "lease_signed",
      "property": "123 Main St",
      "tenant": "John Smith",
      "time": "2 hours ago"
    },
    ...
  ]
}
```

#### Get Recent Activities
```
GET /api/management/dashboard/activities
Query Parameters:
  - limit: number (default: 10)

Response:
{
  "data": [
    {
      "id": 1,
      "type": "lease_signed" | "payment_received" | "maintenance_completed" | "inspection_scheduled" | "tenant_move_out",
      "property": "123 Main St",
      "tenant": "John Smith",
      "amount": 2500,
      "issue": "Plumbing",
      "date": "2024-01-15",
      "time": "2 hours ago"
    },
    ...
  ]
}
```

---

### 2. Properties Management

#### Get All Properties
```
GET /api/management/properties
Query Parameters:
  - status: 'all' | 'occupied' | 'vacant' | 'maintenance'
  - type: 'all' | 'apartment' | 'house' | 'condo'
  - minRent: number
  - maxRent: number
  - page: number
  - limit: number

Response:
{
  "data": [
    {
      "id": "prop-1",
      "address": "123 Main St",
      "status": "occupied",
      "type": "apartment",
      "bedrooms": 2,
      "bathrooms": 1,
      "rent": 2500,
      "tenants": 2,
      "lastInspection": "2024-01-10",
      "maintenanceRequests": 1
    },
    ...
  ],
  "total": 48,
  "page": 1,
  "limit": 10
}
```

#### Get Property by ID
```
GET /api/management/properties/:id

Response:
{
  "id": "prop-1",
  "address": "123 Main St",
  "status": "occupied",
  "type": "apartment",
  "bedrooms": 2,
  "bathrooms": 1,
  "rent": 2500,
  "tenants": 2,
  "lastInspection": "2024-01-10",
  "nextInspection": "2024-02-10",
  "maintenanceRequests": 1,
  "value": 500000
}
```

#### Create Property
```
POST /api/management/properties
Body:
{
  "address": "123 Main St",
  "type": "apartment",
  "bedrooms": 2,
  "bathrooms": 1,
  "rent": 2500,
  "value": 500000
}

Response: { "id": "prop-1", ...property data }
```

#### Update Property
```
PUT /api/management/properties/:id
Body:
{
  "address": "123 Main St",
  "status": "occupied",
  "rent": 2600
}

Response: { ...updated property data }
```

#### Delete Property
```
DELETE /api/management/properties/:id

Response: { "success": true, "message": "Property deleted" }
```

#### Bulk Update Properties
```
POST /api/management/properties/bulk-update
Body:
{
  "ids": ["prop-1", "prop-2", "prop-3"],
  "data": { "status": "maintenance" }
}

Response: { "updated": 3, "failed": 0 }
```

---

### 3. Tasks Management

#### Get All Tasks
```
GET /api/management/tasks
Query Parameters:
  - status: 'all' | 'pending' | 'in_progress' | 'completed'
  - priority: 'all' | 'urgent' | 'high' | 'medium' | 'low'
  - type: 'all' | 'inspection' | 'maintenance' | 'administrative' | 'tenant' | 'financial'
  - page: number
  - limit: number

Response:
{
  "data": [
    {
      "id": "task-1",
      "title": "Inspection task",
      "type": "inspection",
      "priority": "high",
      "status": "pending",
      "dueDate": "2024-01-15",
      "property": "Property 1",
      "assignedTo": "User 1"
    },
    ...
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

#### Get Task by ID
```
GET /api/management/tasks/:id

Response:
{
  "id": "task-1",
  "title": "Inspection task",
  "description": "Complete inspection for assigned property",
  "type": "inspection",
  "priority": "high",
  "status": "pending",
  "dueDate": "2024-01-15",
  "property": "Property 1",
  "assignedTo": "User 1",
  "createdAt": "2024-01-10"
}
```

#### Create Task
```
POST /api/management/tasks
Body:
{
  "title": "Inspection task",
  "description": "Complete inspection",
  "type": "inspection",
  "priority": "high",
  "dueDate": "2024-01-15",
  "property": "prop-1",
  "assignedTo": "user-1"
}

Response: { "id": "task-1", ...task data }
```

#### Update Task
```
PUT /api/management/tasks/:id
Body:
{
  "status": "in_progress",
  "priority": "urgent"
}

Response: { ...updated task data }
```

#### Delete Task
```
DELETE /api/management/tasks/:id

Response: { "success": true, "message": "Task deleted" }
```

#### Bulk Update Tasks
```
POST /api/management/tasks/bulk-update
Body:
{
  "ids": ["task-1", "task-2"],
  "data": { "status": "completed" }
}

Response: { "updated": 2, "failed": 0 }
```

---

### 4. Maintenance Management

#### Get All Maintenance Requests
```
GET /api/management/maintenance
Query Parameters:
  - status: 'all' | 'pending' | 'in_progress' | 'completed'
  - priority: 'all' | 'emergency' | 'urgent' | 'routine'
  - page: number
  - limit: number

Response:
{
  "data": [
    {
      "id": "maint-1",
      "property": "Property 1",
      "unit": "Unit 1",
      "issue": "Plumbing",
      "priority": "urgent",
      "status": "pending",
      "reportedBy": "Tenant 1",
      "reportedDate": "2024-01-10",
      "assignedTo": null,
      "estimatedCost": 1500,
      "estimatedCompletion": null
    },
    ...
  ],
  "total": 8,
  "page": 1,
  "limit": 10
}
```

#### Get Maintenance by ID
```
GET /api/management/maintenance/:id

Response:
{
  "id": "maint-1",
  "property": "Property 1",
  "unit": "Unit 1",
  "issue": "Plumbing",
  "description": "Leak in bathroom",
  "priority": "urgent",
  "status": "pending",
  "reportedBy": "Tenant 1",
  "reportedDate": "2024-01-10",
  "assignedTo": null,
  "estimatedCost": 1500,
  "estimatedCompletion": null,
  "notes": []
}
```

#### Create Maintenance Request
```
POST /api/management/maintenance
Body:
{
  "property": "prop-1",
  "unit": "unit-1",
  "issue": "Plumbing",
  "description": "Leak in bathroom",
  "priority": "urgent",
  "reportedBy": "tenant-1"
}

Response: { "id": "maint-1", ...maintenance data }
```

#### Update Maintenance Request
```
PUT /api/management/maintenance/:id
Body:
{
  "status": "in_progress",
  "assignedTo": "technician-1",
  "estimatedCompletion": "2024-01-12"
}

Response: { ...updated maintenance data }
```

#### Delete Maintenance Request
```
DELETE /api/management/maintenance/:id

Response: { "success": true, "message": "Maintenance request deleted" }
```

#### Bulk Update Maintenance
```
POST /api/management/maintenance/bulk-update
Body:
{
  "ids": ["maint-1", "maint-2"],
  "data": { "status": "completed" }
}

Response: { "updated": 2, "failed": 0 }
```

---

### 5. Financial Management

#### Get Financial Summary
```
GET /api/management/financial/summary
Query Parameters:
  - timeRange: 'week' | 'month' | 'quarter' | 'year'

Response:
{
  "totalRevenue": 125000,
  "totalExpenses": 85000,
  "netIncome": 40000,
  "collectionRate": 98.5,
  "averageRent": 2604,
  "occupancyRate": 87.5
}
```

#### Get Financial Reports
```
GET /api/management/financial/reports
Query Parameters:
  - startDate: ISO date
  - endDate: ISO date
  - type: 'income' | 'expense' | 'all'

Response:
{
  "data": [
    {
      "id": "report-1",
      "date": "2024-01-10",
      "type": "income",
      "amount": 2500,
      "property": "Property 1",
      "description": "Rent payment"
    },
    ...
  ]
}
```

---

### 6. Analytics

#### Get Analytics Data
```
GET /api/management/analytics
Query Parameters:
  - timeRange: 'week' | 'month' | 'quarter' | 'year'

Response:
{
  "propertyDistribution": [
    { "name": "Occupied", "value": 42 },
    { "name": "Vacant", "value": 6 },
    { "name": "Maintenance", "value": 2 }
  ],
  "taskDistribution": [
    { "name": "Completed", "value": 45 },
    { "name": "In Progress", "value": 23 },
    { "name": "Pending", "value": 12 }
  ],
  "maintenanceDistribution": [
    { "name": "Emergency", "value": 3 },
    { "name": "Urgent", "value": 7 },
    { "name": "Routine", "value": 15 }
  ]
}
```

---

### 7. Export

#### Export Data
```
GET /api/management/export/:type
Query Parameters:
  - type: 'properties' | 'tasks' | 'maintenance' | 'financial'
  - format: 'csv' | 'json' | 'pdf'
  - filters: JSON string of filters

Response:
- CSV: File download
- JSON: File download
- PDF: File download
```

---

## 🔄 Implementation Steps

### Step 1: Update Environment Variables
```
# .env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 2: Verify API Service
The API service is already created at `/frontend/src/services/managementAPI.js`

### Step 3: Implement Backend Endpoints
Create these endpoints in your backend:
- `/api/management/dashboard/*`
- `/api/management/properties/*`
- `/api/management/tasks/*`
- `/api/management/maintenance/*`
- `/api/management/financial/*`
- `/api/management/analytics`
- `/api/management/export/*`

### Step 4: Test API Calls
```javascript
import { managementAPI } from '../../services/managementAPI';

// Test dashboard stats
const stats = await managementAPI.getDashboardStats('month');
console.log(stats);

// Test properties
const properties = await managementAPI.getProperties();
console.log(properties);
```

### Step 5: Handle Errors
The dashboard already has error handling with fallback to mock data.

---

## 📊 Data Validation

### Property Validation
```javascript
{
  address: string (required),
  status: 'occupied' | 'vacant' | 'maintenance' (required),
  type: 'apartment' | 'house' | 'condo' (required),
  bedrooms: number (required),
  bathrooms: number (required),
  rent: number (required),
  tenants: number,
  lastInspection: ISO date,
  maintenanceRequests: number
}
```

### Task Validation
```javascript
{
  title: string (required),
  type: 'inspection' | 'maintenance' | 'administrative' | 'tenant' | 'financial' (required),
  priority: 'urgent' | 'high' | 'medium' | 'low' (required),
  status: 'pending' | 'in_progress' | 'completed' (required),
  dueDate: ISO date (required),
  property: string (required),
  assignedTo: string
}
```

### Maintenance Validation
```javascript
{
  property: string (required),
  unit: string,
  issue: string (required),
  priority: 'emergency' | 'urgent' | 'routine' (required),
  status: 'pending' | 'in_progress' | 'completed' (required),
  reportedBy: string (required),
  reportedDate: ISO date (required),
  estimatedCost: number,
  assignedTo: string
}
```

---

## 🔐 Authentication

All API calls include the auth token automatically:
```javascript
// Token is injected in request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 🚀 Testing

### Test with Mock Data
The dashboard works with mock data by default. No backend needed for testing UI.

### Test with Real API
1. Start your backend server
2. Update `REACT_APP_API_URL` in `.env`
3. Refresh the dashboard
4. Check browser console for API calls

### Debug API Calls
```javascript
// Add logging to API service
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

---

## 📝 Notes

- All endpoints should return paginated data for large datasets
- Implement proper error handling on backend
- Add rate limiting for export endpoints
- Consider caching for frequently accessed data
- Implement WebSocket for real-time updates
- Add audit logging for all operations

---

## ✅ Checklist

- [ ] Implement all dashboard endpoints
- [ ] Add proper error handling
- [ ] Implement pagination
- [ ] Add data validation
- [ ] Set up CORS
- [ ] Test all filters
- [ ] Test export functionality
- [ ] Implement real-time updates
- [ ] Add audit logging
- [ ] Performance optimization
