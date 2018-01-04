const HTTPStatus = require('http-status');
const User = require('./../models/User');
const { CRUDMessages } = require('./../constants/messages');
const { isMongoObjectId } = require('./../utils/validator');
const { NotFoundError, Error } = require('./../utils/errorHandlers');

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
    if (!userId || !isMongoObjectId(userId)) {
      throw new NotFoundError(CRUDMessages.NOT_FOUND('User'));
    }

    const user = await User.findById(userId, 'firstName lastName phoneNumber login.email');
    if (!user) {
      throw new NotFoundError(CRUDMessages.NOT_FOUND('User'));
    }

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
      throw new Error(CRUDMessages.DUPLICATE('User', email));
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
      throw new Error(CRUDMessages.CREATE_FAIL('User'));
    }

    return res.status(HTTPStatus.CREATED).json({ message: CRUDMessages.SUCCESSFULLY_CREATED('User') });
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
      throw new Error(CRUDMessages.UPDATE_FAIL('User'));
    }

    res.status(HTTPStatus.OK).json({ message: CRUDMessages.SUCCESSFULLY_UPDATED('User') });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId || !isMongoObjectId(userId)) {
      throw new NotFoundError(CRUDMessages.NOT_FOUND('User'));
    }

    const user = await User.findByIdAndRemove(userId);
    if (!user) {
      throw new Error(CRUDMessages.DELETE_FAIL('User'));
    }

    res.status(HTTPStatus.OK).json({ message: CRUDMessages.SUCCESSFULLY_DELETED('User') });
  } catch (err) {
    next(err);
  }
};
