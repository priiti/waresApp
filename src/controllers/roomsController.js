const Room = require('./../models/Room');

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json({ rooms });
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('No room found!');
    }
    res.status(200).json({ room });
  } catch (err) {
    next(err);
  }
};

exports.createNewRoom = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const room = await Room.findOne({ name });
    if (room) {
      throw new Error(`Room ${name} already exists!`);
    }

    const newRoom = new Room({ name, description });
    await newRoom.save();
    res.status(201).json({ newRoom });
  } catch (err) {
    next(err);
  }
};
