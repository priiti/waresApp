const { body, validationResult } = require('express-validator/check');
const { UnprocessableEntityError } = require('./errors');

const errorCheck = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new UnprocessableEntityError(message));
  }
  return next();
};

exports.createAssetValidation = [
  body('inventoryId').exists().isLength({ min: 1 }).withMessage('Please provide inventory id number!'),
  body('serialNumber').exists().isLength({ min: 1 }).withMessage('Please provide correct serial number!'),
  body('deviceType').exists().isLength({ min: 1 }).withMessage('Please select correct device type!'),
  body('deviceStatus').exists().isLength({ min: 1 }).withMessage('Please select correct device status!'),
  body('description').exists().isLength({ min: 1 }).withMessage('Please provide description!'),
  body('name').exists().isLength({ min: 1 }).withMessage('Please provide device name!'),
  body('user').exists().isLength({ min: 1 }).withMessage('Please select correct user!'),
  errorCheck
];

exports.createRoomValidation = [
  body('name').exists().isLength({ min: 1 }).withMessage('Please provide correct name for the room!'),
  body('description').exists().isLength({ min: 1 }).withMessage('Please provide correct description for the room!'),
  errorCheck
];

