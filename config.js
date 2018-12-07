/** Shared config for application; can be req'd many places. */

require('dotenv').config();

const PORT = +process.env.PORT || 3001;
let BASE_URL = 'http://localhost:3000';

module.exports = {
  PORT,
  BASE_URL
};
