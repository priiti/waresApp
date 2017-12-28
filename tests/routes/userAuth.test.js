const { expect } = require('chai');
const mongoose = require('mongoose');
const { AuthMessage } = require('./../../src/constants/messages');

const User = mongoose.model('User');

module.exports = (request) => {
  const registrationDataForNewUser = {
    firstName: 'John',
    lastName: 'Example',
    email: 'john.example@example.com',
    phoneNumber: '55555555',
    password: 'SomePassword!'
  };

  const invalidRegistrationDataForNewUser = {
    firstName: 'John',
    lastName: 'Example',
    email: 'john.exampleexample.com',
    phoneNumber: '55555555',
    password: '11'
  };

  describe('POST: api/auth/local/register', () => {
    it('should register new user with valid data', (done) => {
      request
        .post('/api/auth/local/register')
        .send(registrationDataForNewUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const newRegisteredUser = await User.findOne({ 'login.email': registrationDataForNewUser.email });
            expect(newRegisteredUser).property('firstName').to.equal(registrationDataForNewUser.firstName);
            expect(newRegisteredUser).property('lastName').to.equal(registrationDataForNewUser.lastName);
            expect(newRegisteredUser.login).property('email').to.equal(registrationDataForNewUser.email);
            expect(newRegisteredUser).property('phoneNumber').to.equal(registrationDataForNewUser.phoneNumber);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should not register user with a same email address', (done) => {
      request
        .post('/api/auth/local/register')
        .send(registrationDataForNewUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(done);
    });

    it('should return 400 Bad Request if invalid registration data', (done) => {
      request
        .post('/api/auth/local/register')
        .send(invalidRegistrationDataForNewUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(422)
        .end(done);
    });
  });

  describe('POST /api/auth/login', () => {
    const validUser = {
      email: registrationDataForNewUser.email,
      password: registrationDataForNewUser.password
    };

    const invalidUser = {
      email: 'random@random.com',
      password: 'random'
    };

    let validToken = null;

    it('should login with valid email and password, receive token', (done) => {
      request
        .post('/api/auth/login')
        .send(validUser)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          validToken = res.body.token;

          expect(validToken);
          done();
        });
    });

    it('should return 400 Bad Request with error message', (done) => {
      request
        .post('/api/auth/login')
        .send(invalidUser)
        .set('Accept', 'application/json')
        .expect(400)
        .end((err, res) => {
          if (err) { done(err); }

          const { message } = res.body;
          expect(message).to.equal(AuthMessage.LOGIN_FAIL);
          done();
        });
    });
  });
};
