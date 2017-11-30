const mongoose = require('mongoose');

const deviceTypeSchema = new mongoose.Schema({
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
  collection: 'deviceType'
});

const DeviceType = mongoose.model('DeviceType', deviceTypeSchema);
module.exports = DeviceType;
