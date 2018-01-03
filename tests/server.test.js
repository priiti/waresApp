require('dotenv').config({ path: '.env' });
const path = require('path');
const fs = require('fs');
const app = require('./../src/app');
const logger = require('./../src/utils/logger');
const request = require('supertest')(app);

const DeviceType = require('./../src/models/DeviceType');
const User = require('./../src/models/User');
const Room = require('./../src/models/Room');
const db = require('./../src/db');

const createObjectFromJSON = filename =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, filename), 'UTF-8'));

const deviceTypesSeedData = createObjectFromJSON('./test-data/deviceType.json');
const roomsSeedData = createObjectFromJSON('./test-data/rooms.json');
const usersSeedData = createObjectFromJSON('./test-data/users.json');

const clearTestDatabase = async () => {
  try {
    await DeviceType.remove({});
    await User.remove({});
    await Room.remove({});
  } catch (err) {
    logger.error(err);
  }
};

const insertTestData = () =>
  Promise.all([
    DeviceType.create(deviceTypesSeedData),
    Room.create(roomsSeedData),
    User.create(usersSeedData)
  ]);

describe('API TESTS', () => {
  before(async () => {
    await db.connectDatabase();
    await clearTestDatabase();
    await insertTestData();
  });

  describe('User auth:', () => require('./routes/userAuth.test')(request));
  describe('User management:', () => require('./routes/userManagement')(request));
  describe('Device types:', () => require('./routes/deviceType.test')(request));
  describe('Room:', () => require('./routes/room.test')(request));

  after(async () => {
    await db.closeDatabaseConnection();
  });
});
