const DeviceStatus = require('./../models/DeviceStatus');

exports.getDeviceStatuses = async (req, res, next) => {
  try {
    const deviceStatuses = await DeviceStatus.find({});
    res.send(deviceStatuses);
  } catch (err) {
    next(err);
  }
};

exports.getDeviceStatusById = async (req, res, next) => {
  try {
    const { statusId } = req.params;
    const deviceStatus = await DeviceStatus.findById(statusId);

    if (!deviceStatus) {
      throw new Error('No device status found!');
    }
    res.send(deviceStatus);
  } catch (err) {
    next(err);
  }
};

exports.createNewDeviceStatus = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      throw new Error('Name is missing!');
    }

    const deviceStatus = await DeviceStatus.findOne({ name });
    if (deviceStatus) {
      throw new Error(`Device status ${name} already exists!`);
    }

    const newDeviceStatus = new DeviceStatus({ name, description });
    await newDeviceStatus.save();

    res.status(200).send(newDeviceStatus);
  } catch (err) {
    next(err);
  }
};
