const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

mongoose.connection.on('connected', () => {
  console.log('Database connected!');
});

mongoose.connection.on('error', error => console.log(JSON.stringify(error, undefined, 2)));

module.exports = mongoose;
