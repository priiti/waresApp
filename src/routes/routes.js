const router = require('express').Router();
const validator = require('./../utils/validator');
const assetsController = require('./../controllers/assetsController');
const roomsController = require('./../controllers/roomsController');
const devicesStatusesController = require('./../controllers/deviceStatusesController');
const devicesTypesController = require('./../controllers/deviceTypesController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/usersController');
const incidentsController = require('./../controllers/incidentsController');
const { allowRoles, jwtEnsure } = require('./../auth/jwt');
const { ADMIN } = require('./../constants/roles');

/** Method jwtEnsure makes sure that user is logged / holds valid jwt token
 *  Method allowRoles is used to check what role user has
 *  Routes can be restricted via json web token and by roles
 *  All routes are currently not restricted for development purposes,
 *  tests are run using roles and authentication
*/

/**
 * Assets routes
 */
router.get('/assets', assetsController.getAssets);
router.get('/assets/:assetId', assetsController.getAssetById);
router.post('/assets', validator.assetValidation, assetsController.createNewAsset);

/**
  * Rooms routes
*/
router.get('/rooms', roomsController.getRooms);
router.get('/rooms/:roomId', roomsController.getRoomById);
router.post('/rooms', validator.roomValidation, roomsController.createNewRoom);
router.patch('/rooms/:roomId', validator.roomValidation, roomsController.updateRoom);
router.delete('/rooms/:roomId', roomsController.deleteRoom);

/**
 * Device statuses routes
*/
router.get('/devices/statuses', devicesStatusesController.getDeviceStatuses);
router.get('/devices/statuses/:statusId', devicesStatusesController.getDeviceStatusById);
router.post('/devices/statuses', validator.deviceStatusValidation, devicesStatusesController.createNewDeviceStatus);
router.patch('/devices/statuses/:statusId', validator.deviceStatusValidation, devicesStatusesController.updateDeviceStatus);
router.delete('/devices/statuses/:statusId', devicesStatusesController.deleteDeviceStatus);

/**
 * Device types routes
*/
router.get('/devices/types', jwtEnsure, devicesTypesController.getDeviceTypes);
router.get('/devices/types/:typeId', jwtEnsure, devicesTypesController.getDeviceTypeById);
router.post('/devices/types', jwtEnsure, allowRoles([ADMIN]), validator.deviceTypesValidation, devicesTypesController.createNewDeviceType);
router.patch('/devices/types/:typeId', jwtEnsure, allowRoles([ADMIN]), validator.deviceTypesValidation, devicesTypesController.updateDeviceType);
router.delete('/devices/types/:typeId', jwtEnsure, allowRoles([ADMIN]), devicesTypesController.deleteDeviceType);

/**
 * Auth routes
 */
router.post('/auth/local/register', validator.createUserValidation, authController.registerUser);
router.post('/auth/forgot', validator.passwordResetEmail, authController.forgotPassword);
router.get('/auth/reset/:token', authController.validatePasswordResetToken);
router.post('/auth/reset/:token', validator.passwordResetMatchValidation, authController.updatePassword);
router.post('/auth/login', authController.login);
router.post('/auth/logout', jwtEnsure, authController.logout);

/**
 * Users routes
*/
router.get('/users', jwtEnsure, allowRoles([ADMIN]), userController.getUsers);
router.get('/users/:userId', jwtEnsure, allowRoles([ADMIN]), userController.getUserById);
router.post('/users', jwtEnsure, allowRoles([ADMIN]), validator.createUserValidation, userController.createNewUser);
router.patch('/users/:userId', jwtEnsure, allowRoles([ADMIN]), validator.editUser, userController.updateUser);
router.delete('/users/:userId', jwtEnsure, allowRoles([ADMIN]), userController.deleteUser);

/**
 * Incidents routes
*/
router.get('/incidents', incidentsController.getIncidents);
router.get('/incidents/:id', incidentsController.getIncidentById);
router.post('/incidents', validator.incidentValidation, incidentsController.createNewIncident);
router.delete('/incidents/:incidentId', jwtEnsure, allowRoles([ADMIN]), incidentsController.deleteIncident);

// Health check for Docker
router.get('/healthz', (req, res) => {
  res.send('Healthy');
});

module.exports = router;
