const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  collection: 'rooms'
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
