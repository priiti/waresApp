const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  inventoryId: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    unique: true
  },
  deviceImage: {
    type: String
  },
  deviceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceType',
    required: true
  },
  deviceStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeviceStatus',
    required: true
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
  collection: 'devices'
});

function autoPopulate(next) {
  this
    .populate('deviceStatus')
    .populate('deviceType');

  next();
}

deviceSchema.pre('find', autoPopulate);

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
