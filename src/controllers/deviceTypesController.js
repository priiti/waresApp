const DeviceType = require('./../models/DeviceType');
const { Error } = require('./../utils/errorHandlers');

exports.getDeviceTypes = async (req, res, next) => {
  try {
    const deviceTypes = await DeviceType.find({});
    res.status(200).json({ deviceTypes });
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
    res.status(200).json({ deviceType });
  } catch (err) {
    next(err);
  }
};

exports.createNewDeviceType = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      throw new Error('Name is missing!');
    }

    const deviceType = await DeviceType.findOne({ name });
    if (deviceType) {
      throw new Error(`Device type ${name} already exists!`);
    }

    const newDeviceType = new DeviceType({ name, description });
    await newDeviceType.save();

    res.status(201).json({ newDeviceType });
  } catch (err) {
    next(err);
  }
};
