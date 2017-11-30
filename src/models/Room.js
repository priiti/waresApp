const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date
  }
}, {
  collection: 'rooms'
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
