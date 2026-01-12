# Role-Based Redirection System

## Overview
The authentication system now includes role-based redirection that automatically directs users to their specific dashboard after login or registration based on their assigned role.

## Implementation

### Core Utility: `roleRedirection.js`
Located at: `/src/utils/auth/roleRedirection.js`

**Key Functions:**
- `getRoleDashboardPath(user)` - Returns the correct dashboard path based on user role
- `getDashboardTitle(user)` - Returns the appropriate dashboard title

### Role to Dashboard Mapping

| Role | Dashboard Path | Description |
|------|----------------|-------------|
| `tenant` | `/tenant` | Tenant residential dashboard |
| `landlord` | `/landlord/dashboard` | Individual landlord dashboard |
| `property_manager` | `/management/dashboard` | Professional property manager dashboard |
| `company_admin` | `/company/dashboard` | Company administration dashboard |
| `company_owner` | `/company/dashboard` | Company owner/executive dashboard |
| `portfolio_manager` | `/company/dashboard` | Portfolio management dashboard |
| `system_admin` | `/admin/dashboard` | System administrator dashboard |
| `admin` | `/admin/dashboard` | Admin dashboard (fallback) |
| `leasing_specialist` | `/management/dashboard` | Leasing operations dashboard |
| `maintenance_supervisor` | `/management/dashboard` | Maintenance operations dashboard |
| `financial_controller` | `/company/dashboard` | Financial management dashboard |

### Integration Points

#### 1. **Login Page** (`LoginPage.jsx`)
After successful login, the system:
- Stores token in localStorage
- Stores user data in localStorage
- Calls `getRoleDashboardPath(user)` to determine destination
- Redirects to role-specific dashboard

```javascript
const dashboardPath = getRoleDashboardPath(data.data.user);
navigate(dashboardPath);
```

#### 2. **Registration Pages**
All role-specific registration pages redirect directly to their dashboards:
- `RegisterLandlordPage.jsx` → `/landlord/dashboard`
- `RegisterPropertyManagerPage.jsx` → `/management/dashboard`
- `RegisterCompanyPage.jsx` → `/company/dashboard`
- `RegisterTenantPage.jsx` → `/tenant`

#### 3. **User Data in LocalStorage**
The user object stored includes:
- `role` - Primary role identifier
- `roles` - Array of role objects (if multi-role support)
- User profile information (firstName, lastName, email, etc.)

## Usage

### For Developers
To use the redirection utility in any component:

```javascript
import { getRoleDashboardPath, getDashboardTitle } from '../../utils/auth/roleRedirection';

// Get dashboard path
const path = getRoleDashboardPath(user);

// Get dashboard title
const title = getDashboardTitle(user);
```

### Default Behavior
If user role is not found or doesn't match, the system defaults to:
- `/tenant` (dashboard path)
- `'Dashboard'` (title)

## Future Enhancements

1. **Role-based Layout Components** - Customize headers/navigation based on role
2. **Permission-based Access Control** - Restrict features based on role permissions
3. **Multi-role Support** - Allow users with multiple roles to switch between dashboards
4. **Role Transition** - Handle role changes and re-direct accordingly
5. **Custom Dashboard Preferences** - Save user's preferred dashboard per role

## Related Files
- `/src/pages/auth/LoginPage.jsx` - Login integration
- `/src/pages/auth/RegisterLandlordPage.jsx` - Landlord registration
- `/src/pages/auth/RegisterPropertyManagerPage.jsx` - Property manager registration
- `/src/pages/auth/RegisterCompanyPage.jsx` - Company registration
- `/src/routes/TenantRoutes.jsx` - Tenant dashboard routes
- `/src/routes/LandlordRoutes.jsx` - Landlord dashboard routes
- `/src/routes/ManagementRoutes.jsx` - Property manager dashboard routes
- `/src/routes/CompanyRoutes.jsx` - Company dashboard routes
