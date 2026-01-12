# Landlord Verification Page - Quick Reference

## Page URL
`http://localhost:3000/company/verification/landlords`

## Features
✅ Real database integration with live landlord data
✅ Search by name, email, or phone
✅ Filter by verification status
✅ Pagination (20 items per page)
✅ View landlord details in modal
✅ Verify/Reject/Under Review actions
✅ Add verification notes
✅ Export to CSV
✅ Dark mode support
✅ Statistics dashboard

## API Endpoints

### Get Landlords
```
GET /api/management/landlords/verification
Query: ?search=name&status=pending&page=1&limit=20
```

### Get Single Landlord
```
GET /api/management/landlords/:landlordId/verification
```

### Update Verification
```
PUT /api/management/landlords/:landlordId/verify
Body: { status, notes, verifiedAt }
```

### Bulk Verify
```
POST /api/management/landlords/verification/bulk
Body: { landlordIds: [], status, notes }
```

### Export Data
```
GET /api/management/landlords/verification/export
Query: ?format=csv&status=pending
```

## Database Fields Used
- id, firstName, lastName, email, phone
- verificationStatus (pending, verified, rejected, under_review)
- verificationNotes, verifiedBy, verifiedAt, createdAt

## Files Modified
1. `/frontend/src/pages/company/LandlordVerification.jsx` - Frontend component
2. `/backend/src/controllers/management/landlord-verification.controller.js` - Backend controller
3. `/backend/src/routes/management.routes.js` - Routes (already configured)

## Installation
Ensure `json2csv` is installed:
```bash
npm install json2csv
```

## Testing
1. Navigate to the page
2. Verify data loads from database
3. Test search and filters
4. Try verification actions
5. Export CSV file
6. Test dark mode toggle
