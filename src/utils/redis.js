const Promise = require('bluebird');
const redis = require('redis');
const logger = require('./logger');

Promise.promisifyAll(redis.createClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

client.on('connect', () => {
  logger.info('Redis connected.');
});

client.on('error', (err) => {
  logger.error('Redis error:', err);
});

module.exports = {
  set(key, value, expires) {
    const promise = client.setAsync(key, JSON.stringify(value));
    if (expires) {
      promise.then(() => client.expireAsync(key, expires));
    }
    return promise;
  },
  get(key) {
    return client.getAsync(key).then(value => JSON.parse(value));
  },
  del(key) {
    return client.delAsync(key);
  }
};
