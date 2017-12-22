/* globals before, describe */
require('dotenv').config({ path: '.env' });
const app = require('./../src/app');
const logger = require('./../src/utils/logger');
const request = require('supertest')(app);

const DeviceType = require('./../src/models/DeviceType');
const db = require('./../src/db');

const clearTestDatabase = async () => {
  try {
    await DeviceType.remove({});
  } catch (err) {
    logger.error(err);
  }
};

describe('API TESTS', () => {
  before(async () => {
    await db.connectDatabase();
    await clearTestDatabase();
  });
  describe('api/devices/types/', () => require('./routes/deviceType.test')(request));
});
