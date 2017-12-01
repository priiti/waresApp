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
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date, default: null }
});

assetSchema.statics.getAllAssetsData = function () {
  return this.aggregate([
    {
      $lookup: {
        from: 'devices',
        localField: 'device',
        foreignField: '_id',
        as: 'deviceInfo'
      }
    }, {
      $unwind: '$deviceInfo'
    },
    {
      $lookup: {
        from: 'deviceStatus',
        localField: 'deviceInfo.deviceStatus',
        foreignField: '_id',
        as: 'deviceStatus'
      }
    },
    {
      $unwind: '$deviceStatus'
    },
    {
      $lookup: {
        from: 'deviceType',
        localField: 'deviceInfo.deviceType',
        foreignField: '_id',
        as: 'deviceType'
      }
    }, {
      $unwind: '$deviceType'
    },
    {
      $lookup: {
        from: 'rooms',
        localField: 'room',
        foreignField: '_id',
        as: 'roomInfo'
      }
    }, {
      $unwind: '$roomInfo'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    }, {
      $unwind: '$userInfo'
    },
    {
      $project: {
        deviceInfo: {
          deviceName: '$$ROOT.deviceInfo.name',
          inventoryId: '$$ROOT.deviceInfo.inventoryId',
          deviceStatus: '$$ROOT.deviceStatus.name',
          deviceType: '$$ROOT.deviceType.name'
        },
        roomInfo: {
          roomName: '$$ROOT.roomInfo.name'
        },
        userInfo: {
          deviceUserFullName:
            { $concat: ['$$ROOT.userInfo.firstName', ' ', '$$ROOT.userInfo.lastName'] }
        },
        createdDate: '$$ROOT.createdDate',
        updatedDate: '$$ROOT.updatedDate'
      }
    },
    {
      $sort: { createdDate: -1 }
    }
  ]);
};

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
