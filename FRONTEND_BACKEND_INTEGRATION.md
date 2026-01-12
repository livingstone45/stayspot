# Frontend-Backend Integration Guide

## API Endpoints Structure

This guide shows how the enhanced dashboard pages should connect to backend APIs.

### Base URL
```
https://api.stayspot.com/v1
```

---

## 1. Dashboard Data Endpoints

### GET /landlord/dashboard
```javascript
// Response
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "name": "Sunset Apartments",
        "units": 4,
        "occupied": 4,
        "income": 8000,
        "expenses": 1200,
        "image": "🏢"
      }
    ],
    "financials": {
      "monthlyRevenue": 56200,
      "monthlyExpenses": 12400,
      "netIncome": 43800,
      "projectedIncome": 168600,
      "ytdGrowth": 18.5,
      "avgOccupancy": 92.5,
      "cashFlow": 45000
    },
    "occupancy": {
      "total": 20,
      "occupied": 18,
      "vacant": 2,
      "leased": 18,
      "maintenance": 0,
      "trending": "up"
    },
    "maintenance": [
      {
        "id": 1,
        "unit": "305",
        "issue": "Plumbing issue",
        "priority": "urgent",
        "created": "2024-12-20T14:30:00Z",
        "status": "open"
      }
    ],
    "payments": [
      {
        "id": 1,
        "tenant": "John Doe",
        "unit": "101",
        "amount": 1200,
        "date": "2024-12-20T10:00:00Z",
        "status": "received"
      }
    ],
    "alerts": [
      {
        "id": 1,
        "type": "maintenance",
        "message": "Urgent: Plumbing issue in Unit 305",
        "priority": "urgent",
        "timestamp": "2024-12-20T14:30:00Z"
      }
    ]
  }
}
```

### Expected Data Format
- All dates in ISO 8601 format
- All currency in cents (integer) or decimal
- Status enums: 'open', 'in-progress', 'completed', 'scheduled'
- Priority levels: 'low', 'medium', 'high', 'urgent'

---

## 2. Analytics Endpoints

### GET /landlord/analytics?period=month&property=all
```javascript
// Response
{
  "success": true,
  "data": {
    "revenue": [
      { "month": "Jul", "value": 45000, "avg": 42000 },
      { "month": "Aug", "value": 38000, "avg": 42000 },
      { "month": "Sep", "value": 42000, "avg": 42000 },
      { "month": "Oct", "value": 55000, "avg": 48000 },
      { "month": "Nov", "value": 52000, "avg": 50000 },
      { "month": "Dec", "value": 56200, "avg": 51000 }
    ],
    "occupancy": [
      {
        "property": "Sunset Apartments",
        "rate": 100,
        "units": 4,
        "income": 8500
      }
    ],
    "expenses": [
      { "category": "Maintenance", "value": 3420, "percent": 27.5 },
      { "category": "Utilities", "value": 1800, "percent": 14.5 }
    ],
    "metrics": {
      "revenueGrowth": 12.5,
      "occupancyTrend": 2.3,
      "expenseRatio": 23.4,
      "avgRent": 2450,
      "propertyValue": 2480000,
      "cashOnCash": 8.9,
      "roi": 14.2,
      "capRate": 11.8
    }
  }
}
```

### Query Parameters
- `period`: 'week' | 'month' | 'quarter' | 'year'
- `property`: 'all' | propertyId
- `startDate`: ISO 8601 date (optional)
- `endDate`: ISO 8601 date (optional)

---

## 3. Financials Endpoints

### GET /landlord/financials?period=month
```javascript
// Response
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 56200,
      "totalExpenses": 12400,
      "netIncome": 43800,
      "projectedIncome": 168600,
      "outstanding": 4500,
      "overdue": 1200
    },
    "transactions": [
      {
        "id": 1,
        "date": "2024-12-20",
        "desc": "Rent payment - Unit 101",
        "property": "Sunset Apartments",
        "amount": 2500,
        "type": "income",
        "status": "received"
      },
      {
        "id": 2,
        "date": "2024-12-19",
        "desc": "Maintenance - Plumbing",
        "property": "Riverside Towers",
        "amount": -450,
        "type": "expense",
        "status": "paid"
      }
    ],
    "projections": [
      { "month": "Jan", "revenue": 58000, "expenses": 13200, "net": 44800 },
      { "month": "Feb", "revenue": 60000, "expenses": 13500, "net": 46500 }
    ],
    "paymentStatus": [
      {
        "tenant": "John Doe",
        "unit": "101",
        "dueDate": "2024-12-25",
        "amount": 1200,
        "status": "received"
      }
    ]
  }
}
```

### Transaction Types
- `type`: 'income' | 'expense'
- `status`: 'received' | 'pending' | 'overdue' | 'paid' | 'scheduled'

---

## 4. Tenants Endpoints

### GET /landlord/tenants?tab=current
```javascript
// Response - Current Tenants
{
  "success": true,
  "data": {
    "current": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "(555) 123-4567",
        "unit": "2A",
        "property": "Sunset Apartments",
        "rent": 1200,
        "moveInDate": "2023-01-15",
        "leaseEnd": "2025-01-15",
        "status": "active",
        "paymentStatus": "on-time",
        "documents": 3
      }
    ],
    "applications": [
      {
        "id": 1,
        "name": "Mike Johnson",
        "email": "mike@example.com",
        "phone": "(555) 456-7890",
        "unit": "2B",
        "property": "Sunset Apartments",
        "status": "pending",
        "appliedDate": "2024-12-18",
        "creditScore": 750,
        "income": 65000
      }
    ],
    "pastTenants": [
      {
        "id": 101,
        "name": "James Anderson",
        "email": "james@example.com",
        "unit": "1A",
        "property": "Sunset Apartments",
        "moveOutDate": "2024-06-30",
        "status": "completed",
        "refundStatus": "returned"
      }
    ]
  }
}
```

### Tenant Status Values
- `status`: 'active' | 'pending' | 'reviewing' | 'approved' | 'completed'
- `paymentStatus`: 'on-time' | 'pending' | 'overdue'
- `refundStatus`: 'pending' | 'returned' | 'withheld'

---

## 5. Properties Endpoints

### GET /landlord/properties?search=&filter=all
```javascript
// Response
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "name": "Sunset Apartments",
        "address": "123 Main St, Downtown",
        "type": "Apartment",
        "units": 4,
        "occupied": 4,
        "occupancy": 100,
        "income": 8000,
        "maintenance": 450,
        "expenses": 1200,
        "status": "Active",
        "acquired": "2020-06-15",
        "value": 425000,
        "image": "🏢",
        "roi": 14.2,
        "issues": 0
      }
    ],
    "summary": {
      "totalValue": 3975000,
      "totalIncome": 80200,
      "avgOccupancy": 94.25,
      "totalProperties": 8,
      "yearOverYearGrowth": 5.2
    }
  }
}
```

### Property Filters
- `search`: text search for name/address
- `filter`: 'all' | 'active' | 'maintenance' | 'vacant'
- `sortBy`: 'name' | 'occupancy' | 'income' | 'value'

---

## 6. Additional Endpoints Structure

### GET /landlord/maintenance
```javascript
{
  "data": {
    "requests": [
      {
        "id": 1,
        "unit": "305",
        "property": "Riverside Towers",
        "issue": "Plumbing issue",
        "description": "Water leak in bathroom",
        "priority": "urgent",
        "status": "open",
        "created": "2024-12-20T14:30:00Z",
        "dueDate": "2024-12-22T00:00:00Z",
        "assignedTo": "John Smith",
        "estimatedCost": 450,
        "actualCost": null
      }
    ]
  }
}
```

### GET /landlord/reports?type=occupancy&period=month
```javascript
{
  "data": {
    "reportType": "occupancy",
    "period": "month",
    "generatedDate": "2024-12-21",
    "data": {
      // Report-specific data
    }
  }
}
```

### GET /landlord/alerts?priority=all
```javascript
{
  "data": {
    "alerts": [
      {
        "id": 1,
        "type": "maintenance",
        "message": "Urgent: Plumbing issue in Unit 305",
        "priority": "urgent",
        "timestamp": "2024-12-20T14:30:00Z",
        "read": false,
        "actionUrl": "/maintenance/1"
      }
    ]
  }
}
```

---

## Implementation Example

### React Hook for Fetching Dashboard Data

```javascript
// hooks/useDashboard.js
import { useState, useEffect } from 'react';

export const useDashboard = (period = 'month') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.stayspot.com/v1/landlord/dashboard?period=${period}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return { data, loading, error };
};
```

### Usage in Component

```javascript
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard = () => {
  const { data, loading, error } = useDashboard('month');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {/* Use data.properties, data.financials, etc. */}
    </>
  );
};
```

---

## Error Handling

All endpoints should return consistent error responses:

```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid period parameter",
    "details": {
      "field": "period",
      "value": "invalid",
      "validValues": ["week", "month", "quarter", "year"]
    }
  }
}
```

---

## Authentication

All endpoints require:
- Bearer token in Authorization header
- Valid session token
- User must be landlord role

---

## Rate Limiting

- 100 requests per minute per user
- X-RateLimit-Remaining header in response
- X-RateLimit-Reset header showing reset time

---

## Caching Recommendations

- Dashboard data: Cache 5 minutes
- Analytics data: Cache 15 minutes
- Transaction history: Cache 10 minutes
- Alerts: No cache (real-time)
- Properties: Cache 30 minutes

---

## WebSocket Events for Real-Time Updates

```javascript
// Connected via WebSocket
socket.on('payment:received', (data) => {
  // Update dashboard in real-time
});

socket.on('maintenance:created', (data) => {
  // Add new maintenance request
});

socket.on('alert:triggered', (data) => {
  // Show new alert
});
```

---

This integration guide provides all the necessary information to connect the professional dashboard frontend with a backend API.
