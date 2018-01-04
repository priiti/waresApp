const Asset = require('./../models/Asset');
const Device = require('./../models/Device');
const HTTPStatus = require('http-status');
const { isMongoObjectId, hasInvalidObjectId } = require('./../utils/validator');
const { AssetMessage } = require('./../constants/messages');
const { NotFoundError, Error } = require('./../utils/errorHandlers');

exports.getAssets = async (req, res, next) => {
  try {
    const assets = await Asset.getAllAssetsData();

    res.status(HTTPStatus.OK).json({ assets });
  } catch (err) {
    next(err);
  }
};

exports.getAssetById = async (req, res, next) => {
  try {
    const { assetId } = req.params;

    if (!isMongoObjectId(assetId)) {
      throw new NotFoundError(AssetMessage.ASSET_NOT_FOUND);
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
      throw new NotFoundError(AssetMessage.ASSET_NOT_FOUND);
    }

    res.status(HTTPStatus.OK).json({ asset });
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
      throw new Error(AssetMessage.ASSET_CREATE_FAIL);
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

    res.status(HTTPStatus.CREATED).json({ message: AssetMessage.ASSET_CREATED });
  } catch (err) {
    next(err);
  }
};
