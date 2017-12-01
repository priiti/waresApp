const mongoose = require('mongoose');
const Promise = require('bluebird');
const logger = require('./utils/logger');

mongoose.Promise = Promise;
const isTestEnvironment = process.env.NODE_ENV === 'test';

if (!isTestEnvironment) {
  mongoose.set('debug', true);
}

if (isTestEnvironment) {
  process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;
}

mongoose.connection.on('connected', () => {
  logger.info('Database connected!');
});

mongoose.connection.on('error', (err) => {
  if (err) {
    throw new Error(err);
  }
});

module.exports = mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
