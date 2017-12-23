require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Promise = require('bluebird');
const logger = require('./utils/logger');

mongoose.Promise = Promise;
const { MONGODB_URI, MONGODB_URI_TEST } = process.env;
const isTestEnvironment = process.env.NODE_ENV === 'test';

if (!isTestEnvironment) {
  mongoose.set('debug', true);
}

mongoose.connection.on('connected', () => {
  logger.info('Database connected! 💁');
});

mongoose.connection.on('error', (err) => {
  if (err) {
    throw new Error(err);
  }
});

const databaseConnectionUri = isTestEnvironment ? MONGODB_URI_TEST : MONGODB_URI;

exports.connectDatabase = async () => {
  try {
    await mongoose.connect(databaseConnectionUri, { useMongoClient: true });
  } catch (err) {
    logger.error(err);
  }
};

exports.closeDatabaseConnection = async () => {
  try {
    await mongoose.connection.close(() => {
      logger.warn('Database connection closed! ❌');
    });
  } catch (err) {
    logger.error(err);
  }
};

