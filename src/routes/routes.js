const router = require('express').Router();
const assetsController = require('./../controllers/assetsController');
const roomsController = require('./../controllers/roomsController');

/**
 * Assets routes
 */
router.get('/assets', assetsController.getAssets);
router.get('/assets/:assetId', assetsController.getAssetById);
router.post('/assets', assetsController.createNewAsset);
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
router.get('/rooms/:roomId', roomsController.getRoom);
router.post('/rooms', roomsController.createRoom);

// /**
//  * Users routes
//  */
// router.get('/users');
// router.post('/users');
// router.get('/users/:userId');

module.exports = router;
