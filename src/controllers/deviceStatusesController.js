const DeviceStatus = require('./../models/DeviceStatus');

exports.getDeviceStatuses = async (req, res) => {
  try {
    const deviceStatuses = await DeviceStatus.find({});
    res.send(deviceStatuses);
  } catch (error) {
    console.log(error);
  }
};

exports.getDeviceStatusById = async (req, res) => {
  try {
    const { statusId } = req.params;
    const deviceStatus = await DeviceStatus.findById(statusId);
    if (!deviceStatus) {
      throw new Error('No device status found!');
    }
    res.send(deviceStatus);
  } catch (error) {
    console.log(error);
  }
};

exports.createNewDeviceStatus = async (req, res) => {
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
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};
