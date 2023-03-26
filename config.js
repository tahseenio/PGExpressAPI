require('dotenv').config();
module.exports = {
  password: process.env.PASSWORD,
  port: process.env.PORT || 3000,
};
