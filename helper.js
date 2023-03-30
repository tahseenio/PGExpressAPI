const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64, { N: 1024 });
  return `${salt}:${derivedKey.toString('hex')}`;
};

const verifyPassword = async (password, hash) => {
  const [salt, key] = hash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await scrypt(password, salt, 64, { N: 1024 });
  const isVerified = crypto.timingSafeEqual(keyBuffer, derivedKey);
  return isVerified; //true means the user is authorized
};

module.exports = {
  hashPassword,
  verifyPassword,
};

hashPassword('MAtt');
