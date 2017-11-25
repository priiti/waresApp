const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

function autoPopulate(next) {
  this
    .populate('device')
    .populate('room')
    .populate('user', '_id firstName lastName login.email profileImage phoneNumber');

  next();
}

assetSchema.pre('find', autoPopulate);
assetSchema.pre('findOne', autoPopulate);

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
