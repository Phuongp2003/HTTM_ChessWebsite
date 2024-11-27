const crypto = require('crypto');

const generateSecretKey = function() {
    return crypto.randomBytes(64).toString('hex'); // Generate a 64-byte SECRET_KEY
};

const initSecret = function() {
    const SECRET_KEY = generateSecretKey();
    process.env.SECRET_KEY = SECRET_KEY;
    process.env.REFRESH_TOKEN_EXPIRATION = (7 * 24 * 60 * 60 * 1000).toString(); // Thời gian hết hạn refresh token, 7d
    process.env.ACCESS_TOKEN_EXPIRATION = (60 * 60 * 1000).toString(); // Thời gian hết hạn JWT, 1h
}

module.exports = {
    initSecret
};
