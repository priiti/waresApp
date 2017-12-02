const User = require('./../models/User');
const crypto = require('crypto');

const { Error } = require('./../utils/errorHandlers');

/**
 * User registration
 */
exports.registerUser = async (req, res, next) => {
  try {
    const {
      firstName, lastName, phoneNumber, email, password
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

    return res.status(201).json({ message: 'User was successfully created.' });
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
    const resetLinkSentSuccessMessage = `Password reset link has been sent to ${req.body.email}.`;

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
      throw new Error('Password reset link has been already sent. Please wait to request new one.');
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
      throw new Error('Password reset link invalid or expired. Please try again or contact your administrator');
    }

    res.json({ message: 'Please fill required fields for password reset.' });
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
      throw new Error('Password reset link invalid or expired. Please try again or contact your administrator');
    }

    user.login = {
      ...user.login,
      password: req.body.password,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      passwordUpdatedAt: Date.now()
    };

    await user.save();

    res.json({ message: 'Password reset has been successfully completed.' });
  } catch (err) {
    next(err);
  }
};
