const { body, validationResult, check } = require('express-validator/check');
const { UnprocessableEntityError } = require('./errorHandlers');
const { ObjectId } = require('mongodb');
const { password, user } = require('./ApiConstants');

exports.isMongoObjectId = objectId => !!ObjectId.isValid(objectId);
exports.hasInvalidObjectId = (objectIdList) => {
  let hasErrors = false;
  objectIdList.forEach((id) => {
    if (!ObjectId.isValid(id)) {
      hasErrors = true;
    }
  });
  return hasErrors;
};

const errorCheck = (req, res, next) => {
  console.log(password.PASSWORD_MIN_LENGTH);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new UnprocessableEntityError(message));
  }
  return next();
};

exports.assetValidation = [
  body('inventoryId').exists().isLength({ min: 1 }).withMessage('Please provide inventory id number!'),
  body('serialNumber').exists().isLength({ min: 1 }).withMessage('Please provide correct serial number!'),
  body('deviceTypeId').exists().isLength({ min: 1 }).withMessage('Please select correct device type!'),
  body('deviceStatusId').exists().isLength({ min: 1 }).withMessage('Please select correct device status!'),
  body('description').exists().isLength({ min: 1 }).withMessage('Please provide description!'),
  body('name').exists().isLength({ min: 1 }).withMessage('Please provide device name!'),
  body('userId').exists().isLength({ min: 1 }).withMessage('Please provide correct user!'),
  body('roomId').exists().isLength({ min: 1 }).withMessage('Please provide correct room!'),
  errorCheck
];

exports.createRoomValidation = [
  body('name').exists().isLength({ min: 1 }).withMessage('Please provide correct name for the room!'),
  body('description').exists().isLength({ min: 1 }).withMessage('Please provide correct description for the room!'),
  errorCheck
];

exports.registerUserLocalValidation = [
  body('firstName').isLength({ min: user.MIN_NAME_LENGTH }).withMessage('First name is required.'),
  body('lastName').isLength({ min: user.MIN_NAME_LENGTH }).withMessage('Last name is required.'),
  body('email')
    .isEmail().withMessage('Email is not valid')
    .trim()
    .normalizeEmail({ remove_dots: false }),
  body('phoneNumber').isLength({ min: user.MIN_PHONE_NUMBER }).withMessage('Please provide correct phone number.'),
  body('password').isLength({ min: password.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${password.PASSWORD_MIN_LENGTH} characters long.`),
  errorCheck
];

exports.passwordResetEmail = [
  body('email')
    .isEmail().withMessage('Email is not valid')
    .trim()
    .normalizeEmail({ remove_dots: false }),
  errorCheck
];

exports.passwordResetMatchValidation = [
  body('password').isLength({ min: password.PASSWORD_MIN_LENGTH })
    .withMessage(`Password must be at least ${password.PASSWORD_MIN_LENGTH} characters long.`),
  check('password-confirm')
    .exists()
    .custom((value, { req }) => value === req.body.password),
  errorCheck
];
