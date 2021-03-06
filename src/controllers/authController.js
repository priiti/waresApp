const HTTPStatus = require('http-status');
const crypto = require('crypto');
const User = require('./../models/User');

const { Error } = require('./../utils/errorHandlers');
const { UserMessage, AuthMessage } = require('./../constants/messages');
const { signToken, blacklistToken } = require('./../auth/jwt');
const redis = require('./../utils/redis');
const mail = require('./../utils/mail');

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

    const user = new User({
      firstName,
      lastName,
      phoneNumber,
      login: {
        email,
        password
      }
    });

    await user.save();

    if (!user) {
      throw new Error(UserMessage.USER_CREATE_FAIL);
    }

    return res.status(HTTPStatus.CREATED).json({ message: UserMessage.USER_CREATED });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 'login.email': email });
    if (!user) {
      throw new Error(AuthMessage.LOGIN_FAIL);
    }

    const isMatch = await user.validatePasswords(password);
    if (!isMatch) {
      throw new Error(AuthMessage.LOGIN_FAIL);
    }

    await redis.del(user._id.toString());

    res.json({ token: signToken(user) });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const isTokenBlacklisted = await blacklistToken(req.user);
    if (!isTokenBlacklisted) {
      throw new Error(AuthMessage.UNABLE_TO_BLACKLIST_TOKEN);
    }

    res.json({ message: AuthMessage.LOGOUT_SUCCESS });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const resetLinkSentSuccessMessage = UserMessage.PASSWORD_RESET_LINK(req.body.email);

    const user = await User.findOne({ 'login.email': req.body.email });
    if (!user) {
      return res.json({ message: resetLinkSentSuccessMessage });
    }

    const { email, passwordResetExpires } = user.login;

    // Restrict users by sending spam, password reset link after every 5 minutes
    const passwordResetSentTimestamp =
      passwordResetExpires - parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES, 10);

    if (passwordResetSentTimestamp &&
        passwordResetSentTimestamp +
        parseInt(process.env.PASSWORD_RESET_LINK_LIMIT, 10) > Date.now()) {
      throw new Error(UserMessage.PASSWORD_RESET_LINK_ALREADY_SENT);
    }

    user.login = {
      ...user.login,
      passwordResetToken: crypto.randomBytes(20).toString('hex'),
      passwordResetExpires: Date.now() + parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES, 10)
    };

    await user.save();

    // Send email to user with password reset link
    const passwordResetURL =
      `${process.env.SITE_URL}/account/password/${user.login.passwordResetToken}`;

    await mail.sendMail({
      to: email,
      subject: 'Password reset',
      template: {
        name: 'passwordReset',
        data: { passwordResetURL }
      }
    });

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

    const passwordUpdateDateMoment = Date.now();

    user.login = {
      ...user.login,
      password: req.body.password,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      passwordUpdatedAt: passwordUpdateDateMoment
    };

    await user.save();
    await redis.set((user._id).toString(), passwordUpdateDateMoment);

    res.json({ message: UserMessage.PASSWORD_RESET_SUCCESS });
  } catch (err) {
    next(err);
  }
};
