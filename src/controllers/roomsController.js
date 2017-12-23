const HTTPStatus = require('http-status');
const Room = require('./../models/Room');
const { Error } = require('./../utils/errorHandlers');

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.status(HTTPStatus.OK).json(rooms);
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
    res.status(HTTPStatus.OK).json(room);
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
    res.status(HTTPStatus.CREATED).json({ newRoom });
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const {
      name,
      description
    } = req.body;

    const room = await Room.findOneAndUpdate(
      { _id: roomId },
      { name, description },
      { new: true }
    );

    if (!room) {
      throw new Error('Room was not updated!');
    }

    res.status(HTTPStatus.OK).json({ message: 'Room successfully updated!' });
  } catch (err) {
    next(err);
  }
};
