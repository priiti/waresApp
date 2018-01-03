/* globals describe, it, before */
const { expect } = require('chai');
const mongoose = require('mongoose');

const Room = mongoose.model('Room');

module.exports = (request) => {
  const newRoom = {
    name: 'K-445',
    description: 'Keemia klass'
  };

  describe('POST: /api/rooms', () => {
    it('should create new room', (done) => {
      request
        .post('/api/rooms')
        .send(newRoom)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(async (err, res) => {
          try {
            if (err) { throw new Error(err); }
            const newCreatedRoom = await Room.findOne({ name: newRoom.name });
            expect(newCreatedRoom).property('name').to.equal(newRoom.name);
            done();
          } catch (error) {
            done(error);
          }
        });
    });

    it('should return 400 Bad Request if room already exists', (done) => {
      request
        .post('/api/rooms')
        .send(newRoom)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(done);
    });
  });

  describe('GET: /api/rooms', () => {
    let room = null;

    it('should return rooms', (done) => {
      request
        .get('/api/rooms')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body).length(3);
          [room] = res.body;
          done();
        });
    });

    it('should return room by given ID value', (done) => {
      request
        .get(`/api/rooms/${room._id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) { return done(err); }

          expect(res.body).property('name').equal(room.name);
          done();
        });
    });
  });
};
