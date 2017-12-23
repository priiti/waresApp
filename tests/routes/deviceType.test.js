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
        .expect((res) => {
          const { newDeviceType } = res.body;
          expect(newDeviceType.name).to.equal(newType.name);
          expect(newDeviceType.description).to.equal(newType.description);
          newType._id = newDeviceType._id;
        })
        .end(done);
    });

    it('should not create new device type with the same type name', (done) => {
      request
        .post('/api/devices/types')
        .send(newType)
        .expect(400)
        .end((err, res) => {
          if (err) { return done(err); }

          DeviceType.find({})
            .then((types) => {
              expect(types).to.have.lengthOf(2);
              done();
            })
            .catch(error => done(error));
        });
    });
  });

  describe('GET: api/devices/types', () => {
    it('should return device types', (done) => {
      request
        .get('/api/devices/types')
        .expect(200)
        .expect((res) => {
          const { deviceTypes } = res.body;
          expect(deviceTypes).to.have.lengthOf(2);
        })
        .end(done);
    });
  });

  describe('GET api/devices/types/:typeId', () => {
    it('should return device type by typeId', (done) => {
      request
        .get(`/api/devices/types/${newType._id}`)
        .expect(200)
        .expect((res) => {
          const { deviceType } = res.body;
          expect(deviceType._id).to.equal(newType._id);
          expect(deviceType.name).to.equal(newType.name);
          expect(deviceType.description).to.equal(newType.description);
        })
        .end(done);
    });
  });
};
