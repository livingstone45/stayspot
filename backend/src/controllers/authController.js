const { User } = require('../models');
const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hashed = await authService.hashPassword(password);
    const user = await User.create({ email, password: hashed, name });
    const token = authService.signToken({ id: user.id, email: user.email });
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await authService.comparePassword(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = authService.signToken({ id: user.id, email: user.email });
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
