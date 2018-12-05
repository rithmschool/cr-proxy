/** Shared config for application; can be req'd many places. */

require('dotenv').config();

const PORT = +process.env.PORT || 3000;

module.exports = {
  PORT
};
