const express = require('express');
const TrackingController = require('../../controllers/tracking.controller');
const router = express.Router();
const shopverify = require('../../controllers/shoptokenverify.controller');

router.route('/').post(TrackingController.createTracking);
router.route('/:userId').put(TrackingController.updateTrackingById).get(TrackingController.getTrackingByUserById);
router.route('/updatelocation/tracking').post(shopverify, TrackingController.updateTrackingById);

module.exports = router;
