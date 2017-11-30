/* globals beforeEach, it, before, describe */
const app = require('./../src/server');
const request = require('supertest')(app);
const DeviceType = require('./../src/models/DeviceType');

describe('', () => {
  before(async () => {
    await DeviceType.remove({});
  });
  describe('api/devices/types/', () => require('./routes/deviceType.test')(request));
});

