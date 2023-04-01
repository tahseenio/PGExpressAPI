import crypto from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(crypto.scrypt);

export const hashPassword = async (password: string) => {
  const salt: string = crypto.randomBytes(16).toString('hex');
  const derivedKey: unknown = await scrypt(password, salt, 64);
  const derivedKeyBUFFER: Buffer = derivedKey as Buffer;
  return `${salt}:${derivedKeyBUFFER.toString('hex')}`;
};

export const verifyPassword = async (password: string, hash: string) => {
  const [salt, key]: string[] = hash.split(':');
  const keyBuffer: Buffer = Buffer.from(key, 'hex');
  const derivedKey: unknown = await scrypt(password, salt, 64);
  const derivedKeyBUFFER: Buffer = derivedKey as Buffer;
  const isVerified: Boolean = crypto.timingSafeEqual(
    keyBuffer,
    derivedKeyBUFFER
  );
  return isVerified; //true means the user is authorized
};
