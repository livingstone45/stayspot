const database = require('./database');
const redis = require('./redis');
const cloudinary = require('./cloudinary');
const mail = require('./mail');
const passport = require('./passport');
const socket = require('./socket');
const urls = require('./urls');

module.exports = {
  database,
  redis,
  cloudinary,
  mail,
  passport,
  SocketService: socket,
  urls
};