const { Property } = require('../models');

async function listProperties(req, res, next) {
  try {
    const properties = await Property.findAll({ include: [{ all: true, nested: true }], limit: 100 });
    res.json({ properties });
  } catch (err) {
    next(err);
  }
}

async function createProperty(req, res, next) {
  try {
    const { title, description, address, latitude, longitude, price } = req.body;
    const ownerId = req.user && req.user.id;
    if (!ownerId) return res.status(401).json({ error: 'Unauthorized' });
    const prop = await Property.create({ title, description, address, latitude, longitude, price, ownerId });
    res.status(201).json({ property: prop });
  } catch (err) {
    next(err);
  }
}

module.exports = { listProperties, createProperty };
