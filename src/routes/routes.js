const router = require('express').Router();
const validator = require('./../utils/validator');
const assetsController = require('./../controllers/assetsController');
const roomsController = require('./../controllers/roomsController');
const devicesStatusesController = require('./../controllers/deviceStatusesController');
const devicesTypesController = require('./../controllers/deviceTypesController');

/**
 * Assets routes
 */
router.get('/assets', assetsController.getAssets);
router.get('/assets/:assetId', assetsController.getAssetById);
router.post('/assets', validator.createAssetValidation, assetsController.createNewAsset);
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
router.post('/rooms', validator.createRoomValidation, roomsController.createNewRoom);

// /**
//  * Device statuses routes
//  */
router.get('/devices/statuses', devicesStatusesController.getDeviceStatuses);
router.get('/devices/statuses/:statusId', devicesStatusesController.getDeviceStatusById);
router.post('/devices/statuses', devicesStatusesController.createNewDeviceStatus);

// /**
//  * Device types routes
//  */
router.get('/devices/types', devicesTypesController.getDeviceTypes);
router.get('/devices/types/:typeId', devicesTypesController.getDeviceTypeById);
router.post('/devices/types', devicesTypesController.createNewDeviceType);

// /**
//  * Users routes
//  */
// router.get('/users');
// router.post('/users');
// router.get('/users/:userId');

module.exports = router;
