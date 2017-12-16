const HTTPStatus = require('http-status');
const DeviceType = require('./../models/DeviceType');
const { Error } = require('./../utils/errorHandlers');

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
      throw new Error('No device type found!');
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
      throw new Error(`Device type ${name} already exists!`);
    }

    const newDeviceType = new DeviceType({ name, description });
    await newDeviceType.save();

    res.status(HTTPStatus.CREATED).json({ newDeviceType });
  } catch (err) {
    next(err);
  }
};
