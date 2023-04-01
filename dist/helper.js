var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import crypto from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(crypto.scrypt);
export const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = yield scrypt(password, salt, 64);
    const derivedKeyBUFFER = derivedKey;
    return `${salt}:${derivedKeyBUFFER.toString('hex')}`;
});
export const verifyPassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    const [salt, key] = hash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = yield scrypt(password, salt, 64);
    const derivedKeyBUFFER = derivedKey;
    const isVerified = crypto.timingSafeEqual(keyBuffer, derivedKeyBUFFER);
    return isVerified; //true means the user is authorized
});
//# sourceMappingURL=helper.js.map