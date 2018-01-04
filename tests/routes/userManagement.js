const { expect } = require('chai');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (request) => {
  const adminUser = {
    email: 'admin@test.com',
    password: 'adminPassword!'
  };

  const sampleUser = {
    firstName: 'Sample',
    lastName: 'User',
    phoneNumber: '55555555',
    email: 'sampleUser@test.com',
    password: 'samplePassword'
  };

  let validToken = null;
  let createdUserId = null;

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

  describe('POST: /api/users', () => {
    it('should create new user', (done) => {
      request
        .post('/api/users')
        .send(sampleUser)
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const createdUser = await User.findOne({ 'login.email': sampleUser.email });
            createdUserId = createdUser._id;
            expect(createdUser).property('firstName').to.equal(sampleUser.firstName);
            expect(createdUser).property('lastName').to.equal(sampleUser.lastName);
            expect(createdUser.login).property('email').to.equal(sampleUser.email);
            expect(createdUser).property('phoneNumber').to.equal(sampleUser.phoneNumber);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  const updatedUserData = {
    firstName: 'Test',
    lastName: 'User',
    phoneNumber: '55555555',
    email: 'sampleUser@test.com'
  };

  describe('PATCH: /api/users/:userId', () => {
    it('should update current user', (done) => {
      request
        .patch(`/api/users/${createdUserId}`)
        .send(updatedUserData)
        .set({ Authorization: `Bearer ${validToken}`, Accept: 'application/json' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const createdUser = await User.findOne({ 'login.email': sampleUser.email });
            expect(createdUser).property('firstName').to.equal(updatedUserData.firstName);
            expect(createdUser).property('lastName').to.equal(updatedUserData.lastName);
            expect(createdUser.login).property('email').to.equal(updatedUserData.email);
            expect(createdUser).property('phoneNumber').to.equal(updatedUserData.phoneNumber);
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });
};
