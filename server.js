/** Start server for proxy-server. */
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

// connect to Redis
const client = redis.createClient();

module.exports.client = client;

const app = require('./app');
const { PORT } = require('./config');

client.on('connect', () => {
  console.log('connected to redis!');
});
client.on('error', err => {
  console.log(`Error: ${err}`);
});

app.listen(PORT, function() {
  console.log(`Server starting on port ${PORT}!`);
});
