const HTTPStatus = require('http-status');
const User = require('./../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users =
      await User.find({}, 'firstName lastName phoneNumber login.email');
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user =
      await User.findById(userId, 'firstName lastName phoneNumber login.email');
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.createNewUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password
    } = req.body;

    const existingUser = await User.findOne({ 'login.email': email });
    if (existingUser) {
      throw new Error(`Account with email address ${email} already exists.`);
    }

    const user = await new User({
      firstName,
      lastName,
      phoneNumber,
      login: {
        email,
        password
      }
    }).save();

    if (!user) {
      throw new Error('User was not created!');
    }

    return res.status(HTTPStatus.OK).json({ message: 'User was successfully created.' });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      phoneNumber,
      email
    } = req.body;

    const room = await User.findOneAndUpdate(
      { _id: userId },
      {
        firstName,
        lastName,
        phoneNumber,
        'login.email': email
      },
      { new: true }
    );

    if (!room) {
      throw new Error('User was not updated!');
    }

    res.status(HTTPStatus.OK).json({ message: 'User successfully updated!' });
  } catch (err) {
    next(err);
  }
};
