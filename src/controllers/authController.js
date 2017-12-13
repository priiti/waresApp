const User = require('./../models/User');
const crypto = require('crypto');

const { Error } = require('./../utils/errorHandlers');
const { UserMessage } = require('./../constants/messages');

/**
 * User registration
 */
exports.registerUser = async (req, res, next) => {
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
      throw new Error(UserMessage.DUPLICATE_EMAIL);
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
      throw new Error(UserMessage.USER_CREATE_FAIL);
    }

    return res.status(201).json({ message: UserMessage.USER_CREATED });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {

};

exports.logout = async (req, res, next) => {

};

exports.forgotPassword = async (req, res, next) => {
  try {
    const resetLinkSentSuccessMessage = UserMessage.PASSWORD_RESET_LINK(req.body.email);

    const user = await User.findOne({ 'login.email': req.body.email });
    if (!user) {
      return res.json({ message: resetLinkSentSuccessMessage });
    }

    const { email, passwordResetExpires } = user.login;

    const passwordResetSentTimestamp =
      passwordResetExpires - parseInt(process.env.PASSWORD_RESET_EXPIRES, 10) > Date.now();

    if (passwordResetSentTimestamp &&
        passwordResetSentTimestamp +
        parseInt(process.env.PASSWORD_RESET_LINK_LIMIT, 10) > Date.now()) {
      throw new Error(UserMessage.PASSWORD_RESET_LINK_ALREADY_SENT);
    }

    user.login = {
      ...user.login,
      passwordResetToken: crypto.randomBytes(20).toString('hex'),
      passwordResetExpires: Date.now() + parseInt(process.env.PASSWORD_RESET_EXPIRES, 10)
    };

    await user.save();

    // const passwordResetUrl =
    //   `${process.env.SITE_URL}/account/password/${user.login.passwordResetToken}`;

    // TODO: implement mail sending

    res.json({ message: resetLinkSentSuccessMessage });
  } catch (err) {
    next(err);
  }
};

exports.validatePasswordResetToken = async (req, res, next) => {
  try {
    const user = await User.findOne({
      'login.passwordResetToken': req.params.token,
      'login.passwordResetExpires': { $gt: Date.now() }
    });

    if (!user) {
      throw new Error(UserMessage.PASSWORD_RESET_EXP_INVALID);
    }

    res.json({ message: UserMessage.PASSWORD_REQUIRED_FIELDS });
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      'login.passwordResetToken': req.params.token,
      'login.passwordResetExpires': { $gt: Date.now() }
    });

    if (!user) {
      throw new Error(UserMessage.PASSWORD_RESET_EXP_INVALID);
    }

    user.login = {
      ...user.login,
      password: req.body.password,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      passwordUpdatedAt: Date.now()
    };

    await user.save();

    res.json({ message: UserMessage.PASSWORD_RESET_SUCCESS });
  } catch (err) {
    next(err);
  }
};
