const HTTPStatus = require('http-status');
const DeviceType = require('./../models/DeviceType');
const { Error } = require('./../utils/errorHandlers');
const { CRUDMessages } = require('./../constants/messages');
const { isMongoObjectId } = require('./../utils/validator');

exports.getDeviceTypes = async (req, res, next) => {
  try {
    const deviceTypes = await DeviceType.find({});

    res.status(HTTPStatus.OK).json({ deviceTypes });
  } catch (err) {
    next(err);
  }
};

exports.getDeviceTypeById = async (req, res, next) => {
  try {
    const { typeId } = req.params;

    const deviceType = await DeviceType.findById(typeId);
    if (!deviceType) {
      throw new Error(CRUDMessages.NOT_FOUND('Device type'));
    }

    res.status(HTTPStatus.OK).json({ deviceType });
  } catch (err) {
    next(err);
  }
};

exports.createNewDeviceType = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const deviceType = await DeviceType.findOne({ name });
    if (deviceType) {
      throw new Error(CRUDMessages.DUPLICATE('Device type', name));
    }

    const newDeviceType = new DeviceType({ name, description });
    await newDeviceType.save();

    res.status(HTTPStatus.CREATED).json({ message: CRUDMessages.SUCCESSFULLY_CREATED('Device type') });
  } catch (err) {
    next(err);
  }
};

exports.updateDeviceType = async (req, res, next) => {
  try {
    const { typeId } = req.params;
    if (!typeId || !isMongoObjectId(typeId)) {
      throw new Error(CRUDMessages.NOT_FOUND('Device type'));
    }

    const {
      name,
      description
    } = req.body;

    const deviceType = await DeviceType.findOneAndUpdate(
      { _id: typeId },
      { name, description },
      { new: true }
    );

    if (!deviceType) {
      throw new Error(CRUDMessages.UPDATE_FAIL('Device type'));
    }

    res.status(HTTPStatus.OK).json({ message: CRUDMessages.SUCCESSFULLY_UPDATED('Device type') });
  } catch (err) {
    next(err);
  }
};

exports.deleteDeviceType = async (req, res, next) => {
  try {
    const { typeId } = req.params;
    if (!typeId || !isMongoObjectId(typeId)) {
      throw new Error(CRUDMessages.NOT_FOUND('Device type'));
    }

    const deviceType = await DeviceType.findByIdAndRemove(typeId);
    if (!deviceType) {
      throw new Error(CRUDMessages.NOT_FOUND('Device type'));
    }

    res.status(HTTPStatus.OK).json({ message: CRUDMessages.SUCCESSFULLY_DELETED('Device type') });
  } catch (err) {
    next(err);
  }
};
