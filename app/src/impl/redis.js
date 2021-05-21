const redis = require('redis');

function redisKeysPromise(client, pattern) {
  return new Promise((resolve, reject) => { client.keys(pattern, (error, keys) => { if (error) { return reject(error); } return resolve(keys); }); });
}

function redisGetPromise(client, key) {
  return new Promise((resolve, reject) => { client.get(key, (error, value) => { if (error) { return reject(error); } return resolve(value); }); });
}

function redisSetPromise(client, key, value) {
  return new Promise((resolve, reject) => { client.set(key, value, (error) => { if (error) { return reject(error); } return resolve(); }); });
}

function init() {
  if (process.env.NODUL_USE_REDIS === undefined) {
    console.warn('Not using Redis');
    return undefined;
  }

  const redisHost = process.env.NODUL_REDIS_HOST || '127.0.0.1';
  const redisPort = process.env.NODUL_REDIS_PORT || 6379;

  console.log(`Connecting to Redis '${redisHost}:${redisPort}'`);
  return redis.createClient({
    host: redisHost,
    port: redisPort
  });
}

function close() {
  console.log(`Disconnecting from Redis`);
}

async function getAllValues(client) {
  const keys = await redisKeysPromise(client, '*');
  const values = [];
  for (const key of keys) {
    const value = await redisGetPromise(client, key);
    values.push(`${key}=${value}`);
  }
  return values;
}

async function addValue(client, key, value) {
  return redisSetPromise(client, key, value);
}

module.exports = {
  init: init,
  close: close,
  getAllValues: getAllValues,
  addValue: addValue
}
