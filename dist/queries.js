var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { password, user, host, database } from './config.js';
import { hashPassword, verifyPassword } from './helper.js';
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: 5432,
    ssl: true,
});
export const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
export const getUserById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
export const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    if (yield usernameExists(username)) {
        response.status(403).send(`Username, (${username}) already exists`);
    }
    else {
        const hash = yield hashPassword(password);
        pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hash], (error, results) => {
            if (error) {
                throw error;
            }
            // console.log(results);
            response
                .status(201)
                .send(`User (${username}) added with ID: ${results.rows[0].id}`);
        });
    }
});
export const updateUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    const { username, password } = request.body;
    const hash = yield hashPassword(password);
    pool.query('UPDATE users SET username = $1, password = $2 WHERE id = $3', [username, hash, id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User modified with ID: ${id}`);
    });
});
export const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};
export const usernameExists = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield pool.query('SELECT * FROM users WHERE username=$1', [
        username,
    ]);
    return data.rowCount !== 0;
});
// (async () => console.log(await usernameExists('matt')))(); //true
export const verifyUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM users WHERE username=$1', [
        username,
    ]);
    const HashedPassword = result.rows[0].password;
    return yield verifyPassword(password, HashedPassword);
});
// (async () => console.log(await verifyUser('tash', 'tash')))(); //true means user authorized
export const login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    if (yield usernameExists(username)) {
        const isVerified = yield verifyUser(username, password);
        if (isVerified) {
            response.status(200).send(`User ${username} is authorized`);
        }
        else {
            response.status(404).send(`User ${username} is unauthorized`);
        }
    }
    else {
        response
            .status(403)
            .send(`No username exists. Please create a username and try again`);
    }
});
//# sourceMappingURL=queries.js.map