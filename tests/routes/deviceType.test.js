const { expect } = require('chai');
const mongoose = require('mongoose');

const DeviceType = mongoose.model('DeviceType');

module.exports = (request) => {
  /**
   * User has to be logged in to add device type
   * Only admin is allowed to add device types
   */
  const adminUser = {
    email: 'admin@test.com',
    password: 'adminPassword!'
  };

  const testUser = {
    email: 'testUser@test.com',
    password: 'testUserPassword!'
  };

  const newType = {
    name: 'Laptops',
    description: 'Portable computer'
  };

  const updatedType = {
    name: 'Laptop',
    description: 'Portable computer'
  };

  let validToken = null;

  describe('GET: /api/devices/types', () => {
    it('should received 401 Unauthorized if not logged in / having JWT token', (done) => {
      request
        .get('/api/devices/types')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(done);
    });
  });

  describe('POST: /api/auth/login', () => {
    it('should login user and receive JWT token', (done) => {
      request
        .post('/api/auth/login')
        .send(adminUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const { token } = res.body;
            validToken = token;
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('POST: /api/devices/types', () => {
    it('should create new device type', (done) => {
      request
        .post('/api/devices/types')
        .send(newType)
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
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
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .send(newType)
        .expect(400)
        .end(done);
    });
  });

  describe('GET: /api/devices/types', () => {
    it('should return device types', (done) => {
      request
        .get('/api/devices/types')
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const totalDeviceTypesCount = await DeviceType.find().count();
            const { deviceTypes } = res.body;
            expect(deviceTypes).to.have.lengthOf(totalDeviceTypesCount);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('GET: /api/devices/types/:typeId', () => {
    it('should return device type by typeId', (done) => {
      request
        .get(`/api/devices/types/${newType._id}`)
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
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

  describe('PATCH: /api/devices/types/:typeId', () => {
    it('should update device type', (done) => {
      request
        .patch(`/api/devices/types/${newType._id}`)
        .send(updatedType)
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const updatedDeviceType = await DeviceType.findById(newType._id);
            expect(updatedDeviceType).property('name').to.equal(updatedType.name);
            expect(updatedDeviceType).property('description').to.equal(updatedType.description);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('DELETE: /api/devices/types/:typeId', () => {
    it('should delete device type', (done) => {
      request
        .delete(`/api/devices/types/${newType._id}`)
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const deviceType = await DeviceType.findById(newType._id);
            expect(deviceType).to.be.a('null');
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('POST: api/auth/logout', () => {
    it('should log user (admin) out', (done) => {
      request
        .post('/api/auth/logout')
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(done);
    });
  });

  const newTypeSecond = {
    name: 'Scanner',
    description: 'For scanning documents'
  };

  /**
   * Blacklisted token (after log out will not work)
   */

  describe('POST: /api/devices/types', () => {
    it('should return 401 Unauthorized as token is blacklisted', (done) => {
      request
        .post('/api/devices/types')
        .send(newTypeSecond)
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(401)
        .end(done);
    });
  });

  describe('POST: /api/auth/login', () => {
    it('should login user and receive JWT token', (done) => {
      request
        .post('/api/auth/login')
        .send(testUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const { token } = res.body;
            validToken = token;
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('POST: /api/devices/types', () => {
    it('should return 401 Unauthorized when not being admin', (done) => {
      request
        .post('/api/devices/types')
        .send(newType)
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(401)
        .end(done);
    });
  });

  describe('POST: /api/auth/logout', () => {
    it('should log user (admin) out', () => {
      request
        .post('/api/auth/logout')
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });
};
