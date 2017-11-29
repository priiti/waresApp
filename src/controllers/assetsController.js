const Asset = require('./../models/Asset');
const Device = require('./../models/Device');
const { ObjectId } = require('mongodb');

const validateMongoObjectId = objectId => !!ObjectId.isValid(objectId);

exports.getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.getAllAssetsData();

    res.send(assets);
  } catch (err) {
    next(err);
  }
};

exports.getAssetById = async (req, res, next) => {
  try {
    const { assetId } = req.params;

    if (!validateMongoObjectId(assetId)) {
      throw new Error('Asset not found!');
    }

    const asset = await Asset.findOne({ _id: assetId });
    if (!asset) {
      throw new Error('Asset not found!');
    }

    res.send(asset);
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
      deviceType,
      deviceStatus,
      room,
      user
    } = req.body;

    const device = new Device({
      name,
      description,
      inventoryId,
      serialNumber,
      deviceType,
      deviceStatus
    });

    const asset = new Asset({
      device: device._id,
      room,
      user
    });

    const newDevice = await device.save();
    const newAsset = await asset.save();

    res.json({
      newDevice,
      newAsset
    });
  } catch (err) {
    next(err);
  }
};
