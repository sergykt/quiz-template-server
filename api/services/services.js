const jwt = require('jsonwebtoken');
const { tokenModel } = require('../models/models');

const secretKey = process.env.JWT_ACCESS_SECRET;
const refreshSecretKey = process.env.JWT_REFRESH_SECRET;

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

class TokenService {
  generateAccessTokens(payload) {
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    try {
      const tokenData = await tokenModel.get(userId);
      if (tokenData) {
        await tokenModel.update(userId, refreshToken);
      } else {
        await tokenModel.create(userId, refreshToken);
      }
    } catch (err) {
      console.error(`[${getCurrentTime()}] Не удалось создать токен`);
      throw err;
    }
  }

  validateAccessToken(accessToken) {
    return jwt.verify(accessToken, secretKey);
  }

  async validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, refreshSecretKey);
      await tokenModel.findToken(refreshToken);
      return userData;
    } catch (err) {
      throw Error('Not valid refresh token');
    }
  }
}

module.exports.getCurrentTime = getCurrentTime;
module.exports.tokenService = new TokenService();
