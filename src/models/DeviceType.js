const mongoose = require('mongoose');

const deviceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, {
  collection: 'deviceType'
});

const DeviceType = mongoose.model('DeviceType', deviceTypeSchema);
module.exports = DeviceType;
