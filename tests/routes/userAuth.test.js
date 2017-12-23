const { expect } = require('chai');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (request) => {
  const registrationDataForNewUser = {
    firstName: 'John',
    lastName: 'Example',
    email: 'john.example@example.com',
    phoneNumber: '55555555',
    password: 'SomePassword!'
  };

  describe('POST: api/auth/local/register', () => {
    it('should register new user with valid data', (done) => {
      request
        .post('/api/auth/local/register')
        .send(registrationDataForNewUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) { return done(err); }

          User.findOne({ 'login.email': registrationDataForNewUser.email })
            .then((user) => {
              expect(user).property('firstName').to.equal(registrationDataForNewUser.firstName);
              expect(user).property('lastName').to.equal(registrationDataForNewUser.lastName);
              expect(user.login).property('email').to.equal(registrationDataForNewUser.email);
              expect(user).property('phoneNumber').to.equal(registrationDataForNewUser.phoneNumber);
              done();
            });
        });
    });

    it('should not register user with a same email address', (done) => {
      request
        .post('/api/auth/local/register')
        .send(registrationDataForNewUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) { return done(err); }

          User.findOne({ 'login.email': registrationDataForNewUser.email }).count()
            .then((count) => {
              expect(count).to.equal(1);
              done();
            });
        });
    });
  });
};
