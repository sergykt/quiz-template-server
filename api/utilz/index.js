const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const generateAccessToken = (id, userRoleId) => {
  const payload = { id, userRoleId };
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};

const utilz = { getCurrentTime, generateAccessToken };

module.exports = utilz;
