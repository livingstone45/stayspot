# API Integration Quick Reference

## Getting Started

### 1. Import the API Client
```javascript
import { 
  getMessages, 
  getNotifications, 
  updateUserProfile 
} from '../../utils/landlordApi';
```

### 2. Use in Components
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await getMessages({ limit: 20 });
    setData(response.data || []);
  } catch (err) {
    setError(err.message);
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
};
```

### 3. Handle Errors
```javascript
// All API calls should have try/catch
try {
  const result = await connectIntegration(id);
  // Handle success
} catch (err) {
  // Display error to user
  setError(err.message || 'An error occurred');
}
```

---

## Common Patterns

### Data Fetching
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getMessages();
      setData(Array.isArray(response.data) ? response.data : response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### Form Submission
```javascript
const [saving, setSaving] = useState(false);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(null);

const handleSave = async (formData) => {
  setSaving(true);
  setError(null);
  setSuccess(null);
  
  try {
    await updateUserProfile(formData);
    setSuccess('Changes saved successfully');
    setTimeout(() => setSuccess(null), 3000);
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};
```

### Toggle/Action Buttons
```javascript
const [loading, setLoading] = useState(null);

const handleToggle = async (id, currentState) => {
  setLoading(id);
  try {
    if (currentState) {
      await disconnectIntegration(id);
    } else {
      await connectIntegration(id);
    }
    // Refresh data
    await loadData();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setLoading(null);
  }
};

<button disabled={loading === id}>
  {loading === id ? 'Processing...' : 'Connect'}
</button>
```

---

## API Functions Reference

### Communications
```javascript
// Get messages
const messages = await getMessages({ limit: 20, page: 1 });

// Send message
await sendMessage({ 
  recipientId: 'uuid', 
  content: 'message text' 
});

// Get announcements
const announcements = await getAnnouncements({ limit: 10 });

// Create announcement
await createAnnouncement({ 
  title: 'Title', 
  content: 'Content' 
});

// Send bulk email
await sendBulkEmail({ 
  recipients: ['id1', 'id2'], 
  subject: 'Subject',
  content: 'Email content'
});
```

### Analytics
```javascript
// Get analytics with time range
const analytics = await getAnalytics({ timeRange: 'month' });

// Get revenue data
const revenue = await getRevenueData({ timeRange: 'month' });

// Get occupancy data
const occupancy = await getOccupancyData({ timeRange: 'month' });
```

### Alerts/Notifications
```javascript
// Get notifications
const notifications = await getNotifications({ 
  limit: 20, 
  type: 'error' 
});

// Dismiss notification
await dismissNotification(notificationId);
```

### Integrations
```javascript
// Get all integrations
const integrations = await getIntegrations();

// Connect integration
await connectIntegration(integrationId);

// Disconnect integration
await disconnectIntegration(integrationId);
```

### User Settings
```javascript
// Get user settings
const settings = await getUserSettings();

// Update settings (preferences, notifications)
await updateUserSettings({ 
  currency: 'USD',
  emailAlerts: true 
});

// Update profile
await updateUserProfile({ 
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
});

// Change password
await changePassword({
  currentPassword: 'old123',
  newPassword: 'new123'
});
```

### Properties
```javascript
// Get properties
const properties = await getProperties({ limit: 20 });

// Get single property
const property = await getProperty(propertyId);
```

### Tenants
```javascript
// Get tenants
const tenants = await getTenants({ limit: 20 });
```

### Financial
```javascript
// Get payments
const payments = await getPayments({ 
  status: 'pending',
  limit: 20 
});

// Get invoices
const invoices = await getInvoices({ limit: 20 });
```

### Maintenance
```javascript
// Get maintenance requests
const requests = await getMaintenanceRequests({ 
  status: 'open',
  limit: 20 
});

// Update maintenance request
await updateMaintenanceRequest(requestId, { 
  status: 'in-progress' 
});
```

---

## Error Handling

### API Errors
```javascript
// All API functions throw errors on failure
try {
  await sendMessage(data);
} catch (err) {
  // err.message contains error description
  console.error(err.message);
}
```

### Display Errors
```javascript
{error && (
  <div className="p-4 bg-red-50 text-red-800 rounded">
    <AlertCircle className="inline mr-2" />
    {error}
  </div>
)}
```

### Fallback Data
```javascript
// All pages have fallback data for offline testing
const [data, setData] = useState([
  { id: 1, name: 'Sample Item' }
]);

try {
  const result = await getItems();
  setData(result.data || []);
} catch (err) {
  // setData keeps the fallback data
  console.error('Using fallback data:', err);
}
```

---

## Loading States

### Page Loading
```javascript
{loading && (
  <div className="flex items-center justify-center py-12">
    <Loader className="animate-spin mr-2" />
    <p>Loading...</p>
  </div>
)}
```

### Button Loading
```javascript
<button disabled={saving} className="disabled:opacity-50">
  {saving ? 'Saving...' : 'Save'}
</button>
```

### Inline Loading
```javascript
{loading ? (
  <p>Loading data...</p>
) : (
  // Display data
)}
```

---

## Success/Error Messages

### Show Success
```javascript
{success && (
  <div className="p-4 bg-green-50 text-green-800 rounded flex gap-3">
    <CheckCircle className="mt-0.5" />
    {success}
  </div>
)}
```

### Show Error
```javascript
{error && (
  <div className="p-4 bg-red-50 text-red-800 rounded flex gap-3">
    <AlertCircle className="mt-0.5" />
    {error}
  </div>
)}
```

### Auto-Dismiss Messages
```javascript
const [message, setMessage] = useState('');

// After successful operation
setMessage('Success!');
setTimeout(() => setMessage(''), 3000);
```

---

## Authentication

### Token Injection (Automatic)
```javascript
// No need to do this - it's automatic!
// The API client automatically adds: Authorization: Bearer {token}
// Token is read from localStorage.authToken
```

### Storing Token
```javascript
// After login, store token
localStorage.setItem('authToken', token);

// It will be automatically injected in all requests
```

### Removing Token
```javascript
// On logout
localStorage.removeItem('authToken');
```

---

## Example: Complete Page Integration

```javascript
import React, { useState, useEffect } from 'react';
import { getMessages, sendMessage } from '../../utils/landlordApi';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMessages({ limit: 20 });
      setMessages(Array.isArray(response.data) ? response.data : response);
    } catch (err) {
      setError('Failed to load messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    setSaving(true);
    setError(null);
    try {
      await sendMessage({ content: newMessage });
      setSuccess('Message sent!');
      setNewMessage('');
      await loadMessages();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {success && <div className="text-green-600">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}
      
      {loading ? (
        <Loader className="animate-spin" />
      ) : (
        <>
          {messages.map(msg => (
            <div key={msg.id}>{msg.content}</div>
          ))}
          
          <textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={saving}
          />
          <button 
            onClick={handleSend} 
            disabled={saving}
          >
            {saving ? 'Sending...' : 'Send'}
          </button>
        </>
      )}
    </div>
  );
}
```

---

## Debugging Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Look for requests to `/api/*`
4. Check response status and body

### Check Console
```javascript
// Log API calls
console.log('API Response:', response);
console.error('API Error:', error);
```

### Verify Auth Token
```javascript
// Check if token is stored
console.log('Token:', localStorage.getItem('authToken'));
```

### Test API Endpoints
```javascript
// Use API directly in console
const msg = await window.landlordApi.getMessages();
console.log(msg);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check auth token in localStorage |
| 404 Not Found | Verify API URL and endpoint path |
| CORS Error | Backend needs CORS headers |
| Network timeout | Check if backend is running |
| Empty data | Check API response format |
| Fallback data showing | Backend API is failing (check console) |

---

## Best Practices

✅ **DO**
- Always use try/catch for API calls
- Show loading states to users
- Display error messages clearly
- Use fallback data for offline support
- Test with backend running
- Log errors to console for debugging
- Handle edge cases (empty data, null values)

❌ **DON'T**
- Don't ignore error handling
- Don't forget loading states
- Don't hardcode API URLs (use environment variables)
- Don't expose sensitive data in logs
- Don't make multiple identical requests
- Don't forget to cancel requests on component unmount
- Don't assume API response format

---

**For more details, see:** 
- `API_INTEGRATION_SUMMARY.md`
- `API_INTEGRATION_CHECKLIST.md`
- `/frontend/src/utils/landlordApi.js`
