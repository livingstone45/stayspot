const express = require('express');
const { query, param, body } = require('express-validator');
const transportationController = require('../controllers/transportation/transportation.controller');
const { auth, requirePermission } = require('../middleware/auth');
const { validation } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Drivers
router.get('/drivers',
  auth,
  requirePermission('driver:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['active', 'inactive', 'on_trip']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(transportationController.getDrivers)
);

router.get('/drivers/:driverId',
  auth,
  requirePermission('driver:view'),
  param('driverId').isUUID(),
  validation,
  asyncHandler(transportationController.getDriver)
);

router.put('/drivers/:driverId',
  auth,
  requirePermission('driver:edit'),
  param('driverId').isUUID(),
  [
    body('status').optional().isIn(['active', 'inactive', 'on_trip']),
    body('licenseExpiry').optional().isISO8601(),
    body('notes').optional().trim().isLength({ max: 1000 })
  ],
  validation,
  asyncHandler(transportationController.updateDriver)
);

router.get('/drivers/stats/summary',
  auth,
  requirePermission('driver:view'),
  asyncHandler(transportationController.getDriverStats)
);

// Bookings
router.get('/bookings',
  auth,
  requirePermission('booking:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(transportationController.getBookings)
);

router.get('/bookings/:bookingId',
  auth,
  requirePermission('booking:view'),
  param('bookingId').isUUID(),
  validation,
  asyncHandler(transportationController.getBooking)
);

router.put('/bookings/:bookingId',
  auth,
  requirePermission('booking:edit'),
  param('bookingId').isUUID(),
  [
    body('status').optional().isIn(['pending', 'accepted', 'in_progress', 'completed', 'cancelled']),
    body('notes').optional().trim().isLength({ max: 1000 })
  ],
  validation,
  asyncHandler(transportationController.updateBooking)
);

router.get('/bookings/stats/summary',
  auth,
  requirePermission('booking:view'),
  asyncHandler(transportationController.getBookingStats)
);

// Tracking
router.get('/tracking',
  auth,
  requirePermission('tracking:view'),
  [
    query('driverId').optional().isUUID()
  ],
  validation,
  asyncHandler(transportationController.getTracking)
);

router.put('/drivers/:driverId/location',
  auth,
  requirePermission('tracking:edit'),
  param('driverId').isUUID(),
  [
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 })
  ],
  validation,
  asyncHandler(transportationController.updateLocation)
);

// Fleet
router.get('/fleet',
  auth,
  requirePermission('fleet:view'),
  [
    query('search').optional().trim().isLength({ max: 100 }),
    query('status').optional().isIn(['active', 'maintenance', 'inactive']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(transportationController.getFleet)
);

router.get('/fleet/:vehicleId',
  auth,
  requirePermission('fleet:view'),
  param('vehicleId').isUUID(),
  validation,
  asyncHandler(transportationController.getVehicle)
);

router.put('/fleet/:vehicleId',
  auth,
  requirePermission('fleet:edit'),
  param('vehicleId').isUUID(),
  [
    body('status').optional().isIn(['active', 'maintenance', 'inactive']),
    body('maintenanceDate').optional().isISO8601(),
    body('notes').optional().trim().isLength({ max: 1000 })
  ],
  validation,
  asyncHandler(transportationController.updateVehicle)
);

router.get('/fleet/stats/summary',
  auth,
  requirePermission('fleet:view'),
  asyncHandler(transportationController.getFleetStats)
);

// Earnings
router.get('/earnings',
  auth,
  requirePermission('earnings:view'),
  [
    query('period').optional().isIn(['day', 'week', 'month', 'year']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validation,
  asyncHandler(transportationController.getEarnings)
);

router.get('/earnings/stats',
  auth,
  requirePermission('earnings:view'),
  [
    query('period').optional().isIn(['day', 'week', 'month', 'year'])
  ],
  validation,
  asyncHandler(transportationController.getEarningsStats)
);

router.get('/earnings/chart',
  auth,
  requirePermission('earnings:view'),
  [
    query('period').optional().isIn(['day', 'week', 'month', 'year'])
  ],
  validation,
  asyncHandler(transportationController.getEarningsChart)
);

module.exports = router;
