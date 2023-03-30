const crypto = require('crypto');
const { promisify } = require('util');
const scrypt = promisify(crypto.scrypt);

const hash = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, 64, { N: 1024 });
  return `${salt}:${derivedKey.toString('hex')}`;
};

const verify = async (password, hash) => {
  const [salt, key] = hash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await scrypt(password, salt, 64, { N: 1024 });
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
};
