/** Shared config for application; can be req'd many places. */

require('dotenv').config();

const BASE_URL = 'http://localhost:3000';

const PORT = +process.env.PORT || 3001;

module.exports = {
  PORT,
  BASE_URL
};
