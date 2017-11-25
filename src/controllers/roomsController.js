const Room = require('./../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.send(rooms);
  } catch (error) {
    console.log(error);
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('No room found!');
    }
    res.send(room);
  } catch (error) {
    console.log(error);
  }
};

exports.createNewRoom = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      throw new Error('Name or description is missing!');
    }

    const room = await Room.findOne({ name });
    if (room) {
      throw new Error(`Room ${name} already exists!`);
    }

    const newRoom = new Room({ name, description });
    await newRoom.save();
    res.status(200).send(newRoom);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};
