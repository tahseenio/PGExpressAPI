import { Response, Request } from 'express';
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

export const getUsers = (request: Request, response: Response) => {
  pool.query(
    'SELECT * FROM users ORDER BY id ASC',
    (error: Error, results: pg.QueryResult) => {
      console.log(results);
      console.log(typeof results);
      if (error) {
        throw error;
      }
      response.status(200).json(results);
    }
  );
};

export const getUserById = (request: Request, response: Response) => {
  const id = parseInt(request.params.id);

  pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id],
    (error: Error, results: pg.QueryResult) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

export const createUser = async (request: Request, response: Response) => {
  const { username, password } = request.body;

  if (await usernameExists(username)) {
    response.status(403).send(`Username, (${username}) already exists`);
  } else {
    const hash = await hashPassword(password);

    pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hash],
      (error: Error, results: pg.QueryResult) => {
        if (error) {
          throw error;
        }
        console.log(results);
        response
          .status(201)
          .send(`User (${username}) added with ID: ${results.rows[0].id}`);
      }
    );
  }
};

export const updateUser = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  const { username, password } = request.body;
  const hash = await hashPassword(password);

  pool.query(
    'UPDATE users SET username = $1, password = $2 WHERE id = $3',
    [username, hash, id],
    (error: Error, results: pg.QueryResult) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

export const deleteUser = (request: Request, response: Response) => {
  const id = parseInt(request.params.id);

  pool.query(
    'DELETE FROM users WHERE id = $1',
    [id],
    (error: Error, results: pg.QueryResult) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${id}`);
    }
  );
};

export const usernameExists = async (username: string) => {
  const data = await pool.query('SELECT * FROM users WHERE username=$1', [
    username,
  ]);
  return data.rowCount !== 0;
};

// (async () => console.log(await usernameExists('matt')))(); //true

export const verifyUser = async (username: string, password: string) => {
  const result = await pool.query('SELECT * FROM users WHERE username=$1', [
    username,
  ]);
  const HashedPassword = result.rows[0].password;
  return await verifyPassword(password, HashedPassword);
};

// (async () => console.log(await verifyUser('tash', 'tash')))(); //true means user authorized

export const login = async (request: Request, response: Response) => {
  const { username, password } = request.body;

  if (await usernameExists(username)) {
    const isVerified: Boolean = await verifyUser(username, password);
    if (isVerified) {
      response.status(200).send(`User ${username} is authorized`);
    } else {
      response.status(404).send(`User ${username} is unauthorized`);
    }
  } else {
    response
      .status(403)
      .send(`No username exists. Please create a username and try again`);
  }
};
