const mongoose = require('mongoose');

const deviceStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String
}, {
  collection: 'deviceStatus'
});

const DeviceStatus = mongoose.model('DeviceStatus', deviceStatusSchema);
module.exports = DeviceStatus;
