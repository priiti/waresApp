const DeviceType = require('./../models/DeviceType');

exports.getDeviceTypes = async (req, res) => {
  try {
    const deviceTypes = await DeviceType.find({});
    res.send(deviceTypes);
  } catch (error) {
    console.log(error);
  }
};

exports.getDeviceTypeById = async (req, res) => {
  try {
    const { typeId } = req.params;
    const deviceType = await DeviceType.findById(typeId);
    if (!deviceType) {
      throw new Error('No device type found!');
    }
    res.send(deviceType);
  } catch (error) {
    console.log(error);
  }
};

exports.createNewDeviceType = async (req, res) => {
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
    res.status(200).send(newDeviceType);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};
