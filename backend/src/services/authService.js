const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'changeme';
const jwtExpiry = process.env.JWT_EXPIRES_IN || '7d';

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function signToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry });
}

module.exports = {
  hashPassword,
  comparePassword,
  signToken
};
