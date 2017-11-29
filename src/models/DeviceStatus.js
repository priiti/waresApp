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
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date
  }
}, {
  collection: 'deviceStatus'
});

const DeviceStatus = mongoose.model('DeviceStatus', deviceStatusSchema);
module.exports = DeviceStatus;
