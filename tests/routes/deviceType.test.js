/* globals describe, it, before */
const expect = require('expect');
const DeviceType = require('./../../src/models/DeviceType');

module.exports = (request) => {
  const newType = {
    name: 'Laptop',
    description: 'Portable computer'
  };

  describe('POST: api/devices/types', () => {
    it('should create new device type', (done) => {
      request
        .post('/api/devices/types')
        .send(newType)
        .expect(201)
        .expect((res) => {
          const { newDeviceType } = res.body;
          expect(newDeviceType.name).toEqual(newType.name);
          expect(newDeviceType.description).toEqual(newType.description);
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
              expect(types.length).toBe(1);
              done();
            });
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
          expect(deviceTypes.length).toBe(1);
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
          expect(deviceType._id).toBe(newType._id);
          expect(deviceType.name).toBe(newType.name);
          expect(deviceType.description).toBe(newType.description);
        })
        .end(done);
    });
  });
};
