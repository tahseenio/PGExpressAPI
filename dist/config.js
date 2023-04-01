import dotenv from 'dotenv';
dotenv.config();
export const user = process.env.USER;
export const host = process.env.HOST;
export const database = process.env.DATABASE;
export const password = process.env.PASSWORD;
export const port = process.env.PORT || 3000;
//# sourceMappingURL=config.js.map