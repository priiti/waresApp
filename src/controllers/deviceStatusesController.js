const HTTPStatus = require('http-status');
const DeviceStatus = require('./../models/DeviceStatus');
const { CRUDMessages } = require('./../constants/messages');
const { isMongoObjectId } = require('./../utils/validator');
const { Error, NotFoundError } = require('./../utils/errorHandlers');

exports.getDeviceStatuses = async (req, res, next) => {
  try {
    const deviceStatuses = await DeviceStatus.find({});

    res.status(HTTPStatus.OK).json({ deviceStatuses });
  } catch (err) {
    next(err);
  }
};

exports.getDeviceStatusById = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    const deviceStatus = await DeviceStatus.findById(statusId);

    if (!deviceStatus) {
      throw new NotFoundError(CRUDMessages.NOT_FOUND('Device status'));
    }
    res.status(HTTPStatus.OK).json({ deviceStatus });
  } catch (err) {
    next(err);
  }
};

exports.createNewDeviceStatus = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const deviceStatus = await DeviceStatus.findOne({ name });
    if (deviceStatus) {
      throw new Error(CRUDMessages.DUPLICATE('Device status', name));
    }

    const newDeviceStatus = new DeviceStatus({ name, description });
    await newDeviceStatus.save();

    res.status(HTTPStatus.CREATED).json({ message: CRUDMessages.SUCCESSFULLY_CREATED('Device status') });
  } catch (err) {
    next(err);
  }
};

exports.updateDeviceStatus = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    if (!statusId || !isMongoObjectId(statusId)) {
      throw new NotFoundError(CRUDMessages.NOT_FOUND('Device status'));
    }

    const {
      name,
      description
    } = req.body;

    const deviceStatus = await DeviceStatus.findOneAndUpdate(
      { _id: statusId },
      { name, description },
      { new: true }
    );

    if (!deviceStatus) {
      throw new Error(CRUDMessages.UPDATE_FAIL('Device status'));
    }

    res.status(HTTPStatus.OK).json({ message: CRUDMessages.SUCCESSFULLY_UPDATED('Device status') });
  } catch (err) {
    next(err);
  }
};

exports.deleteDeviceStatus = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    if (!statusId || !isMongoObjectId(statusId)) {
      throw new NotFoundError(CRUDMessages.NOT_FOUND('Device status'));
    }

    const deviceStatus = await DeviceStatus.findByIdAndRemove(statusId);
    if (!deviceStatus) {
      throw new Error(CRUDMessages.DELETE_FAIL('Device status'));
    }

    res.status(HTTPStatus.OK).json({ message: CRUDMessages.SUCCESSFULLY_DELETED('Device status') });
  } catch (err) {
    next(err);
  }
};
