const Asset = require('./../models/Asset');
const Device = require('./../models/Device');
const { isMongoObjectId, hasInvalidObjectId } = require('./../utils/validator');

exports.getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.getAllAssetsData();

    res.status(200).json({ assets });
  } catch (err) {
    next(err);
  }
};

exports.getAssetById = async (req, res, next) => {
  try {
    const { assetId } = req.params;

    if (!isMongoObjectId(assetId)) {
      throw new Error('Asset not found!');
    }

    const asset = await Asset.findOne({ _id: assetId })
      .populate({
        path: 'device',
        select: 'name description inventoryId serialNumber',
        populate: {
          path: 'deviceType deviceStatus',
          select: 'name'
        }
      })
      .populate({
        path: 'room',
        select: 'name'
      })
      .populate({
        path: 'user',
        select: 'firstName lastName fullName'
      });
    if (!asset) {
      throw new Error('Asset not found!');
    }

    res.status(200).json({ asset });
  } catch (err) {
    next(err);
  }
};

exports.createNewAsset = async (req, res, next) => {
  try {
    const {
      name,
      description,
      inventoryId,
      serialNumber,
      deviceTypeId,
      deviceStatusId,
      roomId,
      userId
    } = req.body;

    if (hasInvalidObjectId([deviceTypeId, deviceStatusId, roomId, userId])) {
      throw new Error('Errors in form. Please check for fields!');
    }

    const device = new Device({
      name,
      description,
      inventoryId,
      serialNumber,
      deviceType: deviceTypeId,
      deviceStatus: deviceStatusId
    });

    const asset = new Asset({
      device: device._id,
      room: roomId,
      user: userId
    });

    await device.save();
    await asset.save();

    res.status(201).json({ message: 'New asset added!' });
  } catch (err) {
    next(err);
  }
};

exports.updateAsset = async (req, res, next) => {
  try {
    res.status(206).json({ message: 'User successfully updated!' });
  } catch (err) {
    next(err);
  }
};
