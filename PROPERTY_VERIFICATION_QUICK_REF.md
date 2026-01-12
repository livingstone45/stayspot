# Property Verification Page - Quick Reference

## 🚀 Quick Start

### Access the Page
```
URL: http://localhost:3000/company/properties/verification
```

### File Location
```
frontend/src/pages/company/PropertyVerification.jsx
```

## 📊 Key Features at a Glance

| Feature | Description |
|---------|-------------|
| **Real Data** | Fetches from `/api/properties` endpoint |
| **Verification Status** | Verified, Pending, Rejected |
| **Search** | By name, address, or city |
| **Filtering** | By verification status |
| **Pagination** | 10 properties per page |
| **Modal Review** | Detailed property information |
| **Approval Workflow** | Approve/Reject properties |
| **Statistics** | Total, Verified, Pending, Rejected counts |
| **Documents** | Display and download property documents |
| **Dark Mode** | Full theme support |

## 🎨 UI Components

### Header
- Title: "Property Verification"
- Subtitle: "Verify and manage property documents"
- Icon: Badge icon with gradient background

### Statistics Cards (4 columns)
1. Total Properties
2. Verified Properties (with rate %)
3. Pending Properties
4. Rejected Properties

### Search & Filter Bar
- Search input (by name, address, city)
- Status dropdown (All, Verified, Pending, Rejected)

### Properties Table
- Columns: Property | Location | Status | Score | Documents | Last Verified | Actions
- Hover effects
- Responsive scrolling

### Detail Modal
- Property information
- Verification status & score
- Document list with download
- Action buttons (Approve/Reject)

## 🔄 Data Flow

```
Component Mount
    ↓
fetchProperties() API Call
    ↓
Process Response Data
    ↓
Calculate Statistics
    ↓
Render Table & Stats
    ↓
User Interaction (Search/Filter/Review)
    ↓
Update State
    ↓
Re-render UI
```

## 📝 API Endpoints

### Fetch Properties
```
GET /api/properties?page=1&limit=10&status=pending
```

### Update Verification Status
```
PUT /api/properties/:id
Body: { verificationStatus: 'verified' | 'rejected' }
```

## 🎯 Status Colors

| Status | Light Mode | Dark Mode |
|--------|-----------|-----------|
| Verified | Green (bg-green-100) | Green (bg-green-900/20) |
| Pending | Yellow (bg-yellow-100) | Yellow (bg-yellow-900/20) |
| Rejected | Red (bg-red-100) | Red (bg-red-900/20) |

## 🔧 Configuration

### Pagination
```javascript
const limit = 10; // Properties per page
```

### API URL
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Authentication
```javascript
const token = localStorage.getItem('token');
// Included in all API requests
```

## 📱 Responsive Breakpoints

| Screen | Layout |
|--------|--------|
| Mobile | 1 column stats, full-width table |
| Tablet | 2 column stats, scrollable table |
| Desktop | 4 column stats, full table |

## 🎪 State Management

```javascript
// Search & Filter
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('all');

// Data
const [properties, setProperties] = useState([]);
const [stats, setStats] = useState(null);

// UI
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const [selectedProperty, setSelectedProperty] = useState(null);
```

## 🔐 Permissions

- Requires authentication token
- Uses role-based access control
- Backend validates user permissions
- Graceful error handling for unauthorized access

## 🐛 Error Handling

```javascript
try {
  // API call
} catch (error) {
  console.log('Error:', error.message);
  setProperties([]); // Fallback to empty
}
```

## 📊 Statistics Calculation

```javascript
const verified = properties.filter(p => p.verificationStatus === 'verified');
const pending = properties.filter(p => p.verificationStatus === 'pending');
const rejected = properties.filter(p => p.verificationStatus === 'rejected');

setStats({
  totalProperties: properties.length,
  verifiedProperties: verified.length,
  pendingProperties: pending.length,
  rejectedProperties: rejected.length,
  verificationRate: (verified.length / properties.length) * 100
});
```

## 🎬 User Actions

### Search
```javascript
const filteredProperties = properties.filter(property => {
  return !searchTerm || 
    property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase());
});
```

### Filter by Status
```javascript
// Automatically triggers fetchProperties() with new status
onChange={(e) => {
  setFilterStatus(e.target.value);
  setPage(1); // Reset to first page
}}
```

### Approve Property
```javascript
const handleApprove = async (propertyId) => {
  await axios.put(`${API_URL}/properties/${propertyId}`, 
    { verificationStatus: 'verified' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // Update local state
};
```

### Reject Property
```javascript
const handleReject = async (propertyId) => {
  await axios.put(`${API_URL}/properties/${propertyId}`, 
    { verificationStatus: 'rejected' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // Update local state
};
```

## 🎨 Styling Classes

### Containers
- `min-h-screen` - Full viewport height
- `max-w-7xl` - Max width container
- `rounded-xl` - Rounded corners
- `shadow` - Box shadow

### Text
- `text-2xl font-bold` - Large headings
- `text-xs uppercase tracking-wide` - Labels
- `text-sm` - Small text

### Colors
- `bg-gradient-to-br from-blue-500 to-blue-600` - Gradient
- `text-white` - White text
- `hover:bg-slate-100` - Hover state

## 🔄 Refresh Data

```javascript
// Manually refresh
fetchProperties();

// Auto-refresh on filter change
useEffect(() => {
  fetchProperties();
}, [filterStatus, page]);
```

## 📦 Dependencies

```json
{
  "react": "^18.0.0",
  "axios": "^1.0.0",
  "lucide-react": "^latest"
}
```

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Data not loading | Check API URL and token in localStorage |
| Modal not opening | Verify selectedProperty state is set |
| Styles not applying | Clear browser cache and rebuild |
| Dark mode not working | Check useThemeMode hook implementation |
| Pagination not working | Verify totalPages calculation |

## 📈 Performance Tips

1. Use pagination to limit data
2. Debounce search input
3. Memoize expensive calculations
4. Lazy load modal content
5. Use React.memo for table rows

## 🔗 Related Files

- `frontend/src/routes/CompanyRoutes.jsx` - Route configuration
- `backend/src/controllers/properties/property.controller.js` - API logic
- `backend/src/models/Property.js` - Data model
- `frontend/src/hooks/useThemeMode.js` - Theme hook

## 📚 Documentation

- Full docs: `PROPERTY_VERIFICATION_PAGE.md`
- API docs: `docs/api/properties.md`
- Database schema: `database/schemas/stayspot_schema.sql`

## ✅ Verification Checklist

- [x] Real data integration from database
- [x] Verification status tracking
- [x] Search and filtering
- [x] Pagination support
- [x] Modal with detailed view
- [x] Approve/Reject workflow
- [x] Statistics dashboard
- [x] Document management
- [x] Dark mode support
- [x] Responsive design
- [x] Error handling
- [x] Loading states

## 🎯 Next Steps

1. Test with real data
2. Verify API endpoints
3. Check authentication
4. Test on mobile devices
5. Validate dark mode
6. Performance testing
7. User acceptance testing
8. Deploy to production
