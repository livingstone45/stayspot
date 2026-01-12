const db = require('../../config/database');

// Drivers
exports.getDrivers = async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM drivers WHERE company_id = ?';
  const params = [req.user.companyId];

  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const drivers = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM drivers WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: drivers,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getDriver = async (req, res) => {
  const { driverId } = req.params;
  const driver = await db.query('SELECT * FROM drivers WHERE id = ? AND company_id = ?', [driverId, req.user.companyId]);
  
  if (!driver.length) return res.status(404).json({ error: 'Driver not found' });
  
  const trips = await db.query('SELECT * FROM bookings WHERE driver_id = ? ORDER BY created_at DESC LIMIT 10', [driverId]);
  res.json({ data: { ...driver[0], recentTrips: trips } });
};

exports.updateDriver = async (req, res) => {
  const { driverId } = req.params;
  const { status, licenseExpiry, notes } = req.body;

  await db.query('UPDATE drivers SET status = ?, license_expiry = ?, notes = ?, updated_at = NOW() WHERE id = ? AND company_id = ?', 
    [status, licenseExpiry, notes, driverId, req.user.companyId]);

  res.json({ message: 'Driver updated successfully' });
};

exports.getDriverStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
      SUM(CASE WHEN status = 'on_trip' THEN 1 ELSE 0 END) as on_trip,
      AVG(rating) as avg_rating
    FROM drivers WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

// Bookings
exports.getBookings = async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT b.*, d.name as driver_name, d.phone as driver_phone FROM bookings b 
    LEFT JOIN drivers d ON b.driver_id = d.id 
    WHERE b.company_id = ?`;
  const params = [req.user.companyId];

  if (search) {
    query += ' AND (b.passenger_name LIKE ? OR b.pickup_location LIKE ? OR b.dropoff_location LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ' AND b.status = ?';
    params.push(status);
  }

  query += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const bookings = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM bookings WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: bookings,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getBooking = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await db.query(`
    SELECT b.*, d.name as driver_name, d.phone as driver_phone, d.vehicle_number 
    FROM bookings b 
    LEFT JOIN drivers d ON b.driver_id = d.id 
    WHERE b.id = ? AND b.company_id = ?
  `, [bookingId, req.user.companyId]);

  if (!booking.length) return res.status(404).json({ error: 'Booking not found' });
  res.json({ data: booking[0] });
};

exports.updateBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { status, notes } = req.body;

  await db.query('UPDATE bookings SET status = ?, notes = ?, updated_at = NOW() WHERE id = ? AND company_id = ?',
    [status, notes, bookingId, req.user.companyId]);

  res.json({ message: 'Booking updated successfully' });
};

exports.getBookingStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
      SUM(fare) as total_revenue
    FROM bookings WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

// Tracking
exports.getTracking = async (req, res) => {
  const { driverId } = req.query;

  let query = `SELECT b.*, d.name as driver_name, d.phone as driver_phone, d.latitude, d.longitude 
    FROM bookings b 
    LEFT JOIN drivers d ON b.driver_id = d.id 
    WHERE b.company_id = ? AND b.status IN ('pending', 'accepted', 'in_progress')`;
  const params = [req.user.companyId];

  if (driverId) {
    query += ' AND b.driver_id = ?';
    params.push(driverId);
  }

  const activeBookings = await db.query(query, params);
  res.json({ data: activeBookings });
};

exports.updateLocation = async (req, res) => {
  const { driverId } = req.params;
  const { latitude, longitude } = req.body;

  await db.query('UPDATE drivers SET latitude = ?, longitude = ?, updated_at = NOW() WHERE id = ? AND company_id = ?',
    [latitude, longitude, driverId, req.user.companyId]);

  res.json({ message: 'Location updated' });
};

// Fleet
exports.getFleet = async (req, res) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM vehicles WHERE company_id = ?';
  const params = [req.user.companyId];

  if (search) {
    query += ' AND (vehicle_number LIKE ? OR model LIKE ? OR registration_number LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const vehicles = await db.query(query, params);
  const countResult = await db.query('SELECT COUNT(*) as total FROM vehicles WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: vehicles,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getVehicle = async (req, res) => {
  const { vehicleId } = req.params;
  const vehicle = await db.query('SELECT * FROM vehicles WHERE id = ? AND company_id = ?', [vehicleId, req.user.companyId]);

  if (!vehicle.length) return res.status(404).json({ error: 'Vehicle not found' });
  res.json({ data: vehicle[0] });
};

exports.updateVehicle = async (req, res) => {
  const { vehicleId } = req.params;
  const { status, maintenanceDate, notes } = req.body;

  await db.query('UPDATE vehicles SET status = ?, maintenance_date = ?, notes = ?, updated_at = NOW() WHERE id = ? AND company_id = ?',
    [status, maintenanceDate, notes, vehicleId, req.user.companyId]);

  res.json({ message: 'Vehicle updated successfully' });
};

exports.getFleetStats = async (req, res) => {
  const stats = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
      SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive
    FROM vehicles WHERE company_id = ?
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

// Earnings
exports.getEarnings = async (req, res) => {
  const { period = 'month', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  let dateFilter = 'DATE(created_at) = CURDATE()';
  if (period === 'week') dateFilter = 'WEEK(created_at) = WEEK(NOW())';
  if (period === 'month') dateFilter = 'MONTH(created_at) = MONTH(NOW())';
  if (period === 'year') dateFilter = 'YEAR(created_at) = YEAR(NOW())';

  const earnings = await db.query(`
    SELECT 
      d.id, d.name, d.phone, 
      COUNT(b.id) as trips,
      SUM(b.fare) as total_earnings,
      AVG(b.rating) as avg_rating
    FROM drivers d
    LEFT JOIN bookings b ON d.id = b.driver_id AND ${dateFilter}
    WHERE d.company_id = ?
    GROUP BY d.id
    ORDER BY total_earnings DESC
    LIMIT ? OFFSET ?
  `, [req.user.companyId, parseInt(limit), offset]);

  const countResult = await db.query('SELECT COUNT(DISTINCT driver_id) as total FROM bookings WHERE company_id = ?', [req.user.companyId]);

  res.json({
    data: earnings,
    pagination: { page: parseInt(page), limit: parseInt(limit), total: countResult[0].total }
  });
};

exports.getEarningsStats = async (req, res) => {
  const { period = 'month' } = req.query;

  let dateFilter = 'DATE(created_at) = CURDATE()';
  if (period === 'week') dateFilter = 'WEEK(created_at) = WEEK(NOW())';
  if (period === 'month') dateFilter = 'MONTH(created_at) = MONTH(NOW())';
  if (period === 'year') dateFilter = 'YEAR(created_at) = YEAR(NOW())';

  const stats = await db.query(`
    SELECT 
      COUNT(*) as total_trips,
      SUM(fare) as total_earnings,
      AVG(fare) as avg_fare,
      MAX(fare) as max_fare,
      MIN(fare) as min_fare
    FROM bookings 
    WHERE company_id = ? AND ${dateFilter}
  `, [req.user.companyId]);

  res.json({ data: stats[0] });
};

exports.getEarningsChart = async (req, res) => {
  const { period = 'month' } = req.query;

  let groupBy = 'DATE(created_at)';
  if (period === 'week') groupBy = 'DAYNAME(created_at)';
  if (period === 'month') groupBy = 'DAY(created_at)';
  if (period === 'year') groupBy = 'MONTH(created_at)';

  const chartData = await db.query(`
    SELECT 
      ${groupBy} as period,
      SUM(fare) as earnings,
      COUNT(*) as trips
    FROM bookings 
    WHERE company_id = ?
    GROUP BY ${groupBy}
    ORDER BY created_at ASC
  `, [req.user.companyId]);

  res.json({ data: chartData });
};
