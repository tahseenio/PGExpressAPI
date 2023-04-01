import dotenv from 'dotenv';
dotenv.config();
export const user: string | undefined = process.env.USER;
export const host: string | undefined = process.env.HOST;
export const database: string | undefined = process.env.DATABASE;
export const password: string | undefined = process.env.PASSWORD;
export const port: string | number | undefined = process.env.PORT || 3000;
