const HTTPStatus = require('http-status');
const Room = require('./../models/Room');
const { CRUDMessages } = require('./../constants/messages');
const { isMongoObjectId } = require('./../utils/validator');
const { NotFoundError, Error } = require('./../utils/errorHandlers');

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
      throw new NotFoundError(CRUDMessages.NOT_FOUND('Room'));
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
      throw new Error(CRUDMessages.DUPLICATE('Room', name));
    }

    const newRoom = new Room({ name, description });
    await newRoom.save();

    res.status(HTTPStatus.CREATED).json({ message: CRUDMessages.SUCCESSFULLY_CREATED('Room') });
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
      throw new Error(CRUDMessages.UPDATE_FAIL);
    }

    res.status(HTTPStatus.OK).json({ message: CRUDMessages.SUCCESSFULLY_UPDATED('Room') });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    if (!roomId || !isMongoObjectId(roomId)) {
      throw new NotFoundError(CRUDMessages.NOT_FOUND('Room'));
    }

    const room = await Room.findByIdAndRemove(roomId);
    if (!room) {
      throw new Error(CRUDMessages.DELETE_FAIL('Room'));
    }

    res.status(HTTPStatus.OK).json({ message: CRUDMessages.SUCCESSFULLY_DELETED('Room') });
  } catch (err) {
    next(err);
  }
};
