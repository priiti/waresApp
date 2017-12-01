const { body, validationResult } = require('express-validator/check');
const { UnprocessableEntityError } = require('./errorHandlers');
const { ObjectId } = require('mongodb');

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
  body('deviceName').exists().isLength({ min: 1 }).withMessage('Please provide device name!'),
  body('userId').exists().isLength({ min: 1 }).withMessage('Please provide correct user!'),
  body('roomId').exists().isLength({ min: 1 }).withMessage('Please provide correct room!'),
  errorCheck
];

exports.createRoomValidation = [
  body('name').exists().isLength({ min: 1 }).withMessage('Please provide correct name for the room!'),
  body('description').exists().isLength({ min: 1 }).withMessage('Please provide correct description for the room!'),
  errorCheck
];

