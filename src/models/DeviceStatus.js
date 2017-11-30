const mongoose = require('mongoose');

const deviceStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  collection: 'deviceStatus'
});

const DeviceStatus = mongoose.model('DeviceStatus', deviceStatusSchema);
module.exports = DeviceStatus;
