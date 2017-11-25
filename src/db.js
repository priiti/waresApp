const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;
const isTestEnvironment = process.env.NODE_ENV === 'test';

if (!isTestEnvironment) {
  mongoose.set('debug', true);
}

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

mongoose.connection.on('connected', () => {
  console.log('Database connected!');
});

mongoose.connection.on('error', (err) => {
  if (err) {
    throw new Error(err);
  }
});

module.exports = mongoose;
