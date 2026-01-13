# Dashboard Testing - Complete Setup

## 🎯 Your Testing Task

You need to test that all 4 dashboards are working correctly:
1. **Tenant Dashboard** - For renters
2. **Landlord Dashboard** - For property owners  
3. **Management Dashboard** - For property managers
4. **Company Dashboard** - For company investors

---

## ✅ System Status

| Component | Status | Details |
|-----------|--------|---------|
| **Frontend** | 🟢 LIVE | GitHub Pages - https://livingstone45.github.io/stayspot/ |
| **Auth System** | 🟢 WORKING | Mock authentication with 3 demo accounts |
| **Database** | 🟡 READY | Schema complete, waiting for Railway deployment |
| **Backend** | 🟡 READY | Code complete, waiting for Railway deployment |
| **All 4 Dashboards** | 🟢 CONFIGURED | Routes, pages, and components all set up |

---

## 🚀 Quick Start - Test Now!

### Option 1: Automated Testing (Linux/Mac)
```bash
# Navigate to project folder
cd /home/techhatch/Documents/stayspot

# Run test script
./test-dashboards.sh
```

### Option 2: Manual Testing (All Platforms)
1. Open: https://livingstone45.github.io/stayspot/#/auth/login
2. Follow instructions below for each role

---

## 🧪 Manual Testing - Step by Step

### TEST 1: Tenant Dashboard (5 minutes)

**Step 1: Go to login page**
```
https://livingstone45.github.io/stayspot/#/auth/login
```

**Step 2: Enter tenant credentials**
```
Email: tenant@example.com
Password: password123
```

**Step 3: Click "Login"**
- Expected result: Redirects to https://livingstone45.github.io/stayspot/#/tenant

**Step 4: Verify dashboard**
- [ ] Page loads (no 404 error)
- [ ] Welcome message shows your name
- [ ] Sidebar navigation visible on left
- [ ] Following sections should be visible:
  - [ ] My Unit (unit info)
  - [ ] Lease (lease details)
  - [ ] Payments (rent payment)
  - [ ] Maintenance (repair requests)
  - [ ] Messages (communication)
  - [ ] Documents (lease docs)
  - [ ] Neighborhood (area info)
  - [ ] Market Info (property insights)

**Step 5: Check console**
- Open DevTools: Press **F12**
- Go to **Console** tab
- [ ] No red errors
- [ ] No warnings about undefined

**Step 6: Test responsive**
- Press **F12**
- Click device toggle (Ctrl+Shift+M)
- [ ] Mobile (375x667): Page adjusts
- [ ] Tablet (768x1024): Page adjusts
- [ ] Desktop (1920x1080): Page normal

**Result**: ✅ PASS / ❌ FAIL
**Issues Found**: [List any problems]

---

### TEST 2: Landlord Dashboard (5 minutes)

**Step 1: Logout**
- Look for user menu in top-right
- Click **Logout**
- Should return to login page

**Step 2: Login as landlord**
```
Email: manager@example.com
Password: password123
```

**Step 3: Click "Login"**
- Expected result: Redirects to https://livingstone45.github.io/stayspot/#/landlord

**Step 4: Verify dashboard**
- [ ] Page loads (no 404 error)
- [ ] Different from tenant view
- [ ] Following sections visible:
  - [ ] My Properties (property list with 5 properties)
  - [ ] Add New Property (button)
  - [ ] Tenants (tenant management)
  - [ ] Financials (income/expenses)
  - [ ] Communications (messages)
  - [ ] Maintenance (work orders)
  - [ ] Reports (analytics)
  - [ ] Calendar (schedule)

**Step 5: Check console**
- [ ] No red errors
- [ ] No undefined warnings

**Step 6: Test property data**
- Look for property list
- Should show mock properties like:
  - Sunset Apartments
  - Downtown Complex
  - Riverside Towers
  - etc.

**Result**: ✅ PASS / ❌ FAIL
**Issues Found**: [List any problems]

---

### TEST 3: Management Dashboard (5 minutes)

**Step 1: Logout and login again**
- Email: manager@example.com
- Password: password123

**Step 2: Navigate to management**
```
https://livingstone45.github.io/stayspot/#/management
```

**Step 3: Verify dashboard**
- [ ] Page loads (no 404)
- [ ] Different from landlord view
- [ ] Following sections visible:
  - [ ] Dashboard overview
  - [ ] Tasks/Assignments
  - [ ] Work Orders
  - [ ] Properties
  - [ ] Tenants Directory
  - [ ] Schedule/Calendar
  - [ ] Communications
  - [ ] Analytics/Performance
  - [ ] Expenses
  - [ ] Settings

**Step 4: Check console**
- [ ] No red errors
- [ ] No warnings

**Step 5: Test charts/graphs**
- Look for analytics/charts
- Should display (can be empty/mock data)

**Result**: ✅ PASS / ❌ FAIL
**Issues Found**: [List any problems]

---

### TEST 4: Company Dashboard (5 minutes)

**Step 1: Logout**
- Click Logout button

**Step 2: Login as company**
```
Email: investor@example.com
Password: password123
```

**Step 3: Click "Login"**
- Expected: Redirects to https://livingstone45.github.io/stayspot/#/company

**Step 4: Verify dashboard**
- [ ] Page loads (no 404)
- [ ] Different from other dashboards
- [ ] Following sections visible:
  - [ ] Portfolio Overview
  - [ ] Statistics cards (Properties, Users, Revenue, etc.)
  - [ ] Analytics
  - [ ] Financial Overview
  - [ ] Team Management
  - [ ] Moderators list
  - [ ] Payment Management
  - [ ] Verification Requests
  - [ ] Communications
  - [ ] Reports

**Step 5: Check console**
- [ ] No red errors
- [ ] No warnings

**Step 6: Test statistics**
- Should show statistics like:
  - 1240 Total Properties
  - 45.2K Active Users
  - KES 245M Platform Revenue
  - 99.8% System Health

**Result**: ✅ PASS / ❌ FAIL
**Issues Found**: [List any problems]

---

## ⚠️ Common Issues & How to Fix

### Problem: Page shows 404 or won't load
```
✅ Solution:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear cache: Ctrl+Shift+Delete → Clear all → Confirm
3. Try incognito mode: Ctrl+Shift+N
4. Check URL uses hash: /#/ (not just /)
```

### Problem: Login button doesn't work
```
✅ Solution:
1. Check email exactly: must be tenant@example.com (not tenant@gmail.com)
2. Check password exactly: must be password123
3. Refresh page and try again
4. Check console for errors (F12 → Console)
```

### Problem: Dashboard blank after login
```
✅ Solution:
1. F12 → Application → Local Storage
2. Look for token (accessToken, authToken, or mockAuthToken)
3. Token should be present and start with "eyJ"
4. If missing: refresh page or clear cache
5. Check console for JavaScript errors
```

### Problem: Console shows red errors
```
✅ Solution:
1. Note the error message
2. Hard refresh page (Ctrl+Shift+R)
3. Try different browser
4. Check that all files were saved correctly
5. Report error in test report
```

### Problem: Not responsive on mobile
```
✅ Solution:
1. F12 → Device Toolbar (Ctrl+Shift+M)
2. Select "Mobile" preset (375x667)
3. Scroll and check layout adjusts
4. Should be readable without horizontal scrolling
```

---

## 📊 Testing Checklist

### Cross-Dashboard Tests
- [ ] Can login as tenant
- [ ] Can login as manager/landlord
- [ ] Can login as investor/company
- [ ] Can logout and login as different role
- [ ] Each dashboard looks different
- [ ] Role-based access is enforced

### General Quality
- [ ] No 404 errors on any dashboard
- [ ] No red console errors
- [ ] No network errors (404/500)
- [ ] Page loads in < 3 seconds
- [ ] Navigation works
- [ ] Sidebar menu works
- [ ] Responsive on 3 sizes

### Features Per Dashboard
- [ ] Tenant: 8+ sections visible
- [ ] Landlord: 8+ sections + mock data
- [ ] Management: Tasks/analytics visible
- [ ] Company: Stats/analytics visible

---

## 📝 Test Report Template

After testing, create a summary like this:

```
# Dashboard Testing Results
Date: [Today's date]
Tester: [Your name]

## Results Summary
Total Dashboards: 4
Passed: [X]/4
Failed: [X]/4

## Tenant Dashboard
- Load Status: ✅ PASS / ❌ FAIL
- Components Visible: [List what you saw]
- Errors: [None / list errors]
- Responsive: ✅ Yes / ❌ No
- Notes: [Any observations]

## Landlord Dashboard
- Load Status: ✅ PASS / ❌ FAIL
- Components Visible: [List what you saw]
- Errors: [None / list errors]
- Responsive: ✅ Yes / ❌ No
- Notes: [Any observations]

## Management Dashboard
- Load Status: ✅ PASS / ❌ FAIL
- Components Visible: [List what you saw]
- Errors: [None / list errors]
- Responsive: ✅ Yes / ❌ No
- Notes: [Any observations]

## Company Dashboard
- Load Status: ✅ PASS / ❌ FAIL
- Components Visible: [List what you saw]
- Errors: [None / list errors]
- Responsive: ✅ Yes / ❌ No
- Notes: [Any observations]

## Issues Found
1. [Issue #1]
2. [Issue #2]
3. [Issue #3]

## Overall Status
✅ ALL PASS - System ready for production
❌ ISSUES FOUND - See above for details

## Next Steps
- Deploy to Railway when ready
- Set up production database
- Go fully live with real data
```

---

## 🔗 Quick Links

### Test URLs (After logging in)
```
Tenant:     https://livingstone45.github.io/stayspot/#/tenant
Landlord:   https://livingstone45.github.io/stayspot/#/landlord
Management: https://livingstone45.github.io/stayspot/#/management
Company:    https://livingstone45.github.io/stayspot/#/company
```

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Tenant | tenant@example.com | password123 |
| Manager/Landlord | manager@example.com | password123 |
| Investor/Company | investor@example.com | password123 |

### Developer Tools
- DevTools: Press **F12**
- Device Mode: Ctrl+Shift+M
- Console: F12 → Console tab
- Network: F12 → Network tab
- Storage: F12 → Application → Local Storage

---

## 📚 Documentation Files

Created for your reference:
- **DASHBOARD_TEST_GUIDE.md** - Detailed testing guide (150+ lines)
- **DASHBOARD_QUICK_TEST.md** - Quick reference card
- **test-dashboards.sh** - Automated testing script

---

## ✨ Success Indicators

✅ **You'll know it's working when**:
1. All 4 dashboards load without errors
2. Each dashboard shows different content based on role
3. Console has no red error messages
4. Can login/logout as different users
5. Navigation works within each dashboard
6. Pages are responsive on phone/tablet/desktop

---

## 🎯 Next After Testing

1. **Document Results** 
   - Create test report
   - List any issues found

2. **Fix Any Issues**
   - Address console errors
   - Fix responsive problems

3. **Deploy Backend** (When Ready)
   - Use railway-setup.sh
   - Use railway-finalize.sh

4. **Go Live**
   - Production database ready
   - Real data migration
   - System fully operational

---

## 📞 Need Help?

### Check Console Errors
Most issues appear as red text in DevTools Console (F12)

### Common Fix: Hard Refresh
```
Windows: Ctrl + Shift + R
Mac:     Cmd + Shift + R
```

### Check Mock Auth is Working
File: `frontend/src/services/mockAuth.js`
- Should have 3 demo users
- Should store tokens in localStorage
- Should be imported in useAuth.js

### Verify Routes Exist
All routes configured in:
- `frontend/src/routes/PublicRoutes.jsx`
- `frontend/src/routes/TenantRoutes.jsx`
- `frontend/src/routes/LandlordRoutes.jsx`
- `frontend/src/routes/ManagementRoutes.jsx`
- `frontend/src/routes/CompanyRoutes.jsx`

---

## 🎓 Testing Best Practices

1. **Test in Isolation**
   - Test one dashboard at a time
   - Logout between tests

2. **Check Console Every Time**
   - Open F12 before navigating
   - Check for red errors
   - Note any warnings

3. **Test Responsive**
   - Use F12 device mode
   - Test at least 3 sizes

4. **Document as You Go**
   - Write down what you see
   - Note any issues immediately
   - Take screenshots if needed

5. **Try Different Browsers**
   - Chrome
   - Firefox
   - Safari
   - Edge (optional)

---

## 🏁 You're All Set!

Everything is ready for dashboard testing:
- ✅ Frontend LIVE on GitHub Pages
- ✅ All 4 dashboards built
- ✅ Mock authentication ready
- ✅ Routes configured
- ✅ Demo accounts available
- ✅ Testing guides created
- ✅ Automated script ready

**Start testing now and let me know the results!** 🎉

---

**System Status**: ✅ READY FOR TESTING
**Last Updated**: $(date)
**Frontend URL**: https://livingstone45.github.io/stayspot/
