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

    const asset = await Asset.findOne({ _id: assetId });
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

    if (hasInvalidObjectId([inventoryId, deviceTypeId, deviceStatusId, roomId, userId])) {
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

    const newDevice = await device.save();
    const newAsset = await asset.save();

    res.status(201).json({
      newDevice,
      newAsset
    });
  } catch (err) {
    next(err);
  }
};
