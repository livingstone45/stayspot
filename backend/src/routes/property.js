const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authenticate = require('../middleware/auth');

router.get('/', propertyController.listProperties);
router.post('/', authenticate, propertyController.createProperty);

module.exports = router;
