const { password, user, host, database } = require('./config.js');
const bcrypt = require('bcryptjs');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: 5432,
  //ssl: true,
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createUser = async (request, response) => {
  const { username, password } = request.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hash],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .send(
          `User (${username}) with email (${username}) added with ID: ${results.rows[0].id}`
        );
    }
  );
};

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const { username, password } = request.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [username, hash, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User modified with ID: ${id}`);
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`User deleted with ID: ${id}`);
  });
};

const emailExists = async (email) => {
  const data = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (data.rowCount == 0) return false;
  console.log(data.rowCount);
  return data.rows[0];
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
