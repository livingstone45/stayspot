# Dashboard Testing Guide

## Overview
Testing all 4 dashboards in the StaySpot application:
1. **Tenant Dashboard** - For property renters
2. **Landlord Dashboard** - For property owners
3. **Management Dashboard** - For property managers
4. **Company Dashboard** - For company investors/admins

---

## Testing URLs & Credentials

### ✅ TENANT DASHBOARD
- **URL**: https://livingstone45.github.io/stayspot/#/tenant
- **Login URL**: https://livingstone45.github.io/stayspot/#/auth/login
- **Email**: `tenant@example.com`
- **Password**: `password123`
- **Role Type**: tenant

#### Expected Features:
- [ ] Dashboard displays without errors
- [ ] My Unit information visible
- [ ] Lease details accessible
- [ ] Payment section visible
- [ ] Maintenance requests section
- [ ] Messages/communication section
- [ ] Documents section
- [ ] Neighborhood information
- [ ] Market info visible
- [ ] Settings accessible

**Test Steps**:
1. Open login URL
2. Enter tenant credentials
3. Click Login
4. Verify redirect to /tenant dashboard
5. Check all sections load
6. Review console (F12) for errors

---

### ✅ LANDLORD DASHBOARD
- **URL**: https://livingstone45.github.io/stayspot/#/landlord
- **Login URL**: https://livingstone45.github.io/stayspot/#/auth/login
- **Email**: `manager@example.com`
- **Password**: `password123`
- **Role Type**: property_manager

#### Expected Features:
- [ ] Dashboard displays without errors
- [ ] My Properties section
- [ ] Add New Property button functional
- [ ] Properties listing with details
- [ ] Tenants management section
- [ ] Communications section
- [ ] Financials/Analytics section
- [ ] Maintenance tracking
- [ ] Calendar/Schedule
- [ ] Reports section
- [ ] Settings accessible

**Test Steps**:
1. Open login URL
2. Enter landlord credentials (manager@)
3. Click Login
4. Verify redirect to /landlord dashboard
5. Click "My Properties" - verify list loads
6. Check tenant management features
7. Verify no console errors

---

### ✅ MANAGEMENT DASHBOARD
- **URL**: https://livingstone45.github.io/stayspot/#/management
- **Login URL**: https://livingstone45.github.io/stayspot/#/auth/login
- **Email**: `manager@example.com`
- **Password**: `password123`
- **Role Type**: property_manager (or leasing_specialist/maintenance_supervisor)

#### Expected Features:
- [ ] Dashboard displays without errors
- [ ] Tasks/Assignments section
- [ ] Work orders visible
- [ ] Schedule/Calendar
- [ ] Maintenance requests
- [ ] Property list
- [ ] Tenant directory
- [ ] Communications
- [ ] Analytics/Performance
- [ ] Expense tracking
- [ ] Settings accessible

**Test Steps**:
1. Open login URL
2. Enter manager credentials (manager@)
3. Click Login
4. Verify redirect to /management dashboard
5. Check Tasks section loads
6. Verify work orders display
7. Review performance analytics
8. Check console for errors

---

### ✅ COMPANY DASHBOARD
- **URL**: https://livingstone45.github.io/stayspot/#/company
- **Login URL**: https://livingstone45.github.io/stayspot/#/auth/login
- **Email**: `investor@example.com`
- **Password**: `password123`
- **Role Type**: investor (company_admin/company_owner)

#### Expected Features:
- [ ] Dashboard displays without errors
- [ ] Portfolio overview
- [ ] Analytics section
- [ ] Properties management
- [ ] Financial overview
- [ ] Team management
- [ ] Reports section
- [ ] Payment management
- [ ] Verification requests
- [ ] Communications
- [ ] Settings accessible

**Test Steps**:
1. Open login URL
2. Enter investor credentials (investor@)
3. Click Login
4. Verify redirect to /company dashboard
5. Check Portfolio section
6. Review analytics data
7. Verify financial overview
8. Check console for errors

---

## General Testing Checklist

### For Each Dashboard:
- [ ] Page loads without 404 errors
- [ ] All main sections are visible
- [ ] Navigation menu works
- [ ] No JavaScript errors in console (F12)
- [ ] Responsive on desktop (1920x1080)
- [ ] Responsive on tablet (768x1024)
- [ ] Responsive on mobile (375x667)
- [ ] All buttons/links are clickable
- [ ] Images load properly
- [ ] Sidebar/navigation toggles work
- [ ] User profile shows correct role
- [ ] Logout button functions

### Browser Console Check:
```
Open DevTools: F12
Check Console tab for:
- ✅ No red errors
- ✅ No warnings about undefined variables
- ✅ No 404 errors for resources
- ✅ Token properly loaded
```

### Network Check:
```
Open DevTools: Network tab
Check for:
- ✅ No failed API calls (403/404/500)
- ✅ All resources load (CSS, JS, images)
- ✅ No hanging requests
- ✅ Response times reasonable (<2s)
```

---

## Common Issues & Fixes

### Issue: "Cannot find module" errors
**Solution**: Clear browser cache and refresh
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or open DevTools → Network → Disable cache → Refresh

### Issue: Login fails
**Solution**: Check mock authentication
- Verify email matches exactly: `tenant@example.com`
- Verify password is: `password123`
- Check browser console for auth errors

### Issue: Dashboard blank after login
**Solution**: Check token storage
1. Open DevTools → Application → Local Storage
2. Look for `accessToken`, `authToken`, or `mockAuthToken`
3. Token should be present
4. Try refresh if token exists

### Issue: "Network error" on API calls
**Solution**: Backend not deployed yet (expected)
- This is normal - backend still local/not deployed to Railway
- Mock data should display instead
- Verify mock authentication is working

### Issue: Responsive layout broken on mobile
**Solution**: Check viewport settings
1. Open DevTools → Device Emulation
2. Test iPhone 12, iPad, and desktop sizes
3. Verify layout adjusts correctly

---

## Test Report Template

```markdown
## Tenant Dashboard Test
- Load Status: ✅ Pass / ❌ Fail
- Components Visible: [List what loaded]
- Errors Found: [List any console errors]
- Navigation: ✅ Pass / ❌ Fail
- Responsive: ✅ Pass / ❌ Fail
- Notes: [Any observations]

## Landlord Dashboard Test
- Load Status: ✅ Pass / ❌ Fail
- Components Visible: [List what loaded]
- Errors Found: [List any console errors]
- Navigation: ✅ Pass / ❌ Fail
- Responsive: ✅ Pass / ❌ Fail
- Notes: [Any observations]

## Management Dashboard Test
- Load Status: ✅ Pass / ❌ Fail
- Components Visible: [List what loaded]
- Errors Found: [List any console errors]
- Navigation: ✅ Pass / ❌ Fail
- Responsive: ✅ Pass / ❌ Fail
- Notes: [Any observations]

## Company Dashboard Test
- Load Status: ✅ Pass / ❌ Fail
- Components Visible: [List what loaded]
- Errors Found: [List any console errors]
- Navigation: ✅ Pass / ❌ Fail
- Responsive: ✅ Pass / ❌ Fail
- Notes: [Any observations]

## Overall Summary
- Total Dashboards Tested: 4
- Passing: [X]/4
- Issues Found: [X]
- Ready for Production: ✅ Yes / ❌ No
```

---

## Quick Access Reference

### Direct Dashboard Links (After Login)
```
Tenant:     https://livingstone45.github.io/stayspot/#/tenant
Landlord:   https://livingstone45.github.io/stayspot/#/landlord
Management: https://livingstone45.github.io/stayspot/#/management
Company:    https://livingstone45.github.io/stayspot/#/company
```

### Demo Credentials Summary
| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Tenant | tenant@example.com | password123 | /tenant |
| Landlord/Manager | manager@example.com | password123 | /landlord, /management |
| Company/Investor | investor@example.com | password123 | /company |

---

## Testing Priority

### Phase 1: Critical Path (Must Work)
1. Login functionality
2. Dashboard pages load
3. No console errors
4. Navigation between sections

### Phase 2: Feature Verification
1. All expected sections visible
2. Buttons/links clickable
3. Data displays correctly
4. Role-based access working

### Phase 3: Polish
1. Responsive design
2. Visual consistency
3. Performance optimization
4. Error handling

---

## Notes for Testing

- **Backend Status**: Not yet deployed to Railway. API calls will use mock data or fail gracefully.
- **Authentication**: Using mock authentication service in-app (`mockAuth.js`)
- **Browser**: Test in Chrome, Firefox, Safari for maximum compatibility
- **Resolution**: Test at least 3 breakpoints: desktop (1920x1080), tablet (768x1024), mobile (375x667)
- **Network**: Open DevTools → Network to monitor API calls
- **Console**: Open DevTools → Console to check for errors and warnings

---

## Success Criteria

✅ **Test Passes When**:
1. All 4 dashboards load without 404 errors
2. Each dashboard displays its expected sections
3. Navigation works between sections
4. Console has no red error messages
5. Login/logout functionality works
6. Role-based access is enforced (can't access other roles' dashboards)
7. Responsive design works on mobile/tablet/desktop
8. No network errors (mock data displays instead of backend)

---

## Next Steps After Testing

If all tests pass:
1. ✅ Document findings in `DASHBOARD_TEST_REPORT.md`
2. ✅ Commit test report to GitHub
3. ⏳ Deploy backend to Railway (when ready)
4. ⏳ Set up production database
5. ⏳ Go fully live with persistent data

---

**Test Date**: [To be filled in]
**Tester**: [To be filled in]
**Status**: [To be filled in]
