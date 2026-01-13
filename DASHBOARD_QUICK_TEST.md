# Dashboard Testing - Quick Reference

## 🧪 Live Test URLs

Open these in your browser to test each dashboard:

### 1️⃣ TENANT DASHBOARD
```
🔗 https://livingstone45.github.io/stayspot/#/auth/login
📧 Email: tenant@example.com
🔑 Password: password123
✅ Expected: Should redirect to /#/tenant
```

### 2️⃣ LANDLORD DASHBOARD
```
🔗 https://livingstone45.github.io/stayspot/#/auth/login
📧 Email: manager@example.com
🔑 Password: password123
✅ Expected: Should redirect to /#/landlord
```

### 3️⃣ MANAGEMENT DASHBOARD
```
🔗 https://livingstone45.github.io/stayspot/#/auth/login
📧 Email: manager@example.com
🔑 Password: password123
✅ Expected: Should redirect to /#/management
```

### 4️⃣ COMPANY DASHBOARD
```
🔗 https://livingstone45.github.io/stayspot/#/auth/login
📧 Email: investor@example.com
🔑 Password: password123
✅ Expected: Should redirect to /#/company
```

---

## ✅ Testing Checklist

### Step-by-Step Instructions

#### For Each Dashboard:

1. **Open the login URL** in a new tab
   ```
   https://livingstone45.github.io/stayspot/#/auth/login
   ```

2. **Enter credentials** for the dashboard role you're testing
   - Copy-paste email and password from above

3. **Click "Login"**
   - Page should redirect to the dashboard (e.g., `/#/tenant`)
   - Dashboard should load completely

4. **Check for errors** (Open DevTools: F12 → Console)
   - ✅ Should be GREEN (no red errors)
   - ✅ Should NOT see "Cannot find module" errors
   - ✅ Should NOT see 404 resource errors

5. **Verify components load**
   - Sidebar/Navigation visible
   - Main content area populated
   - All expected sections visible

6. **Test responsive** (Optional but recommended)
   - Press F12 → Toggle device toolbar (Ctrl+Shift+M)
   - Test Mobile (375x667)
   - Test Tablet (768x1024)
   - Test Desktop (1920x1080)

7. **Logout and test next dashboard**
   - Look for Logout button (usually top-right)
   - Return to login page
   - Test next role

---

## 📋 Expected Dashboard Components

### Tenant Dashboard (Should Have)
- [ ] My Unit information
- [ ] Lease details
- [ ] Payment section
- [ ] Maintenance requests
- [ ] Messages/communications
- [ ] Documents
- [ ] Neighborhood info
- [ ] Market insights

### Landlord Dashboard (Should Have)
- [ ] My Properties list
- [ ] Add New Property option
- [ ] Tenants section
- [ ] Financials/Analytics
- [ ] Communications
- [ ] Maintenance tracking
- [ ] Reports
- [ ] Calendar/Schedule

### Management Dashboard (Should Have)
- [ ] Tasks/Assignments
- [ ] Work orders
- [ ] Properties list
- [ ] Tenants directory
- [ ] Schedule/Calendar
- [ ] Communications
- [ ] Performance analytics
- [ ] Expense tracking

### Company Dashboard (Should Have)
- [ ] Portfolio overview
- [ ] Analytics/Reports
- [ ] Properties management
- [ ] Financial overview
- [ ] Team management
- [ ] Payment management
- [ ] Verification requests
- [ ] Communications

---

## 🐛 Troubleshooting

### "Page won't load / stays blank"
```bash
💡 Solution:
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Clear browser cache
3. Try in incognito/private window
4. Try different browser
```

### "Login fails or redirects to login"
```bash
💡 Solution:
1. Check email exactly: tenant@example.com (not tenant@example.io)
2. Check password exactly: password123
3. Check browser console for error messages
4. Make sure you're on the correct URL
```

### "Dashboard blank after login"
```bash
💡 Solution:
1. Check DevTools → Application → Local Storage
2. Should see "accessToken", "authToken", or "mockAuthToken"
3. Try refresh page
4. Check Console for errors
```

### "Network error on API calls"
```bash
✅ This is EXPECTED - Backend not deployed yet
- Mock data should still display
- This is normal during testing phase
```

### "Console shows red errors"
```bash
💡 Solution:
1. Take screenshot of error message
2. Hard refresh the page
3. Try different browser
4. Check file was saved properly
```

---

## 📊 Test Results Template

Create a quick summary:

```
Date: [Today]
Tester: [Your name]

TENANT DASHBOARD: ✅ PASS / ❌ FAIL
- Components visible: [Yes/No]
- Errors: [None / describe]
- Notes: [Any issues]

LANDLORD DASHBOARD: ✅ PASS / ❌ FAIL
- Components visible: [Yes/No]
- Errors: [None / describe]
- Notes: [Any issues]

MANAGEMENT DASHBOARD: ✅ PASS / ❌ FAIL
- Components visible: [Yes/No]
- Errors: [None / describe]
- Notes: [Any issues]

COMPANY DASHBOARD: ✅ PASS / ❌ FAIL
- Components visible: [Yes/No]
- Errors: [None / describe]
- Notes: [Any issues]

OVERALL: ✅ READY / ❌ ISSUES FOUND
```

---

## 🎯 Success Criteria

All 4 dashboards pass when:
- ✅ Page loads (no 404 error)
- ✅ Dashboard displays expected content
- ✅ No red console errors
- ✅ Navigation works
- ✅ All sections clickable
- ✅ Responsive on mobile/tablet/desktop
- ✅ Can logout and login as different roles

---

## 📝 Important Notes

- **Authentication**: Using mock auth (no backend required for testing)
- **Data**: Will be mock data (no real database yet)
- **API Calls**: May fail gracefully (backend not deployed)
- **Deployment**: Frontend is LIVE on GitHub Pages
- **Backend**: Ready to deploy to Railway when needed

---

## 🚀 Next Steps

After testing:
1. Document all results
2. Create test report
3. Fix any issues found
4. Commit to GitHub
5. Deploy backend to Railway
6. Set up production database

**Happy Testing! 🎉**
