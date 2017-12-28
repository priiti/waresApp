/* globals describe, it, before */
const { expect } = require('chai');
const mongoose = require('mongoose');

const DeviceType = mongoose.model('DeviceType');

module.exports = (request) => {
  const newType = {
    name: 'Laptop',
    description: 'Portable computer'
  };

  describe('POST: /api/devices/types', () => {
    it('should create new device type', (done) => {
      request
        .post('/api/devices/types')
        .send(newType)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const newAddedDeviceType = await DeviceType.findOne({ name: newType.name });
            newType._id = newAddedDeviceType._id;
            expect(newAddedDeviceType).property('name').to.equal(newType.name);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should not create new device type with the same type name', (done) => {
      request
        .post('/api/devices/types')
        .send(newType)
        .expect(400)
        .end(done);
    });
  });

  describe('GET: api/devices/types', () => {
    it('should return device types', (done) => {
      request
        .get('/api/devices/types')
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const { deviceTypes } = res.body;
            expect(deviceTypes).to.have.lengthOf(2);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('GET api/devices/types/:typeId', () => {
    it('should return device type by typeId', (done) => {
      request
        .get(`/api/devices/types/${newType._id}`)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const { deviceType } = res.body;
            expect(deviceType.name).to.equal(newType.name);
            expect(deviceType.description).to.equal(newType.description);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });
};
