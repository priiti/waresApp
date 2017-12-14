const router = require('express').Router();
const validator = require('./../utils/validator');
const assetsController = require('./../controllers/assetsController');
const roomsController = require('./../controllers/roomsController');
const devicesStatusesController = require('./../controllers/deviceStatusesController');
const devicesTypesController = require('./../controllers/deviceTypesController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/usersController');
const incidentsController = require('./../controllers/incidentsController');

/**
 * Assets routes
 */
router.get('/assets', assetsController.getAssets);
router.get('/assets/:assetId', assetsController.getAssetById);
router.post('/assets', validator.assetValidation, assetsController.createNewAsset);
/**
 * Categories routes
 */
// router.get('/categories');

// /**
//  * Device routes
//  */
// router.get('/devices');
// router.get('/devices/:deviceId');
// router.post('/devices');
// router.get('/devices/:deviceId');

// /**
//  * Rooms routes
//  */
router.get('/rooms', roomsController.getRooms);
router.get('/rooms/:roomId', roomsController.getRoomById);
router.post('/rooms', validator.roomValidation, roomsController.createNewRoom);
router.patch('/rooms/:roomId', validator.roomValidation, roomsController.updateRoom);

// /**
//  * Device statuses routes
//  */
router.get('/devices/statuses', devicesStatusesController.getDeviceStatuses);
router.get('/devices/statuses/:statusId', devicesStatusesController.getDeviceStatusById);
router.post('/devices/statuses', validator.deviceStatusValidation, devicesStatusesController.createNewDeviceStatus);

// /**
//  * Device types routes
//  */
router.get('/devices/types', devicesTypesController.getDeviceTypes);
router.get('/devices/types/:typeId', devicesTypesController.getDeviceTypeById);
router.post('/devices/types', validator.deviceTypesValidation, devicesTypesController.createNewDeviceType);

/**
 * Auth routes
 */
router.post('/auth/local/register', validator.createUserValidation, authController.registerUser);
router.get('/auth/reset/:token', authController.validatePasswordResetToken);
router.post('/auth/reset/:token', validator.passwordResetMatchValidation, authController.updatePassword);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);

// /**
//  * Users routes
//  */
router.get('/users', userController.getUsers);
router.get('/users/:userId', userController.getUserById);
router.post('/users', validator.createUserValidation, userController.createNewUser);
router.patch('/users/:userId', validator.editUser, userController.updateUser);

// /**
//  * Incidents routes
//  */
router.get('/incidents', incidentsController.getIncidents);
router.get('/incidents/:id', incidentsController.getIncidentById);
router.post('/incidents', incidentsController.createNewIncident);

module.exports = router;
