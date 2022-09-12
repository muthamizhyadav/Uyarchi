const express = require('express');
const TrackingController = require('../../controllers/tracking.controller');
const router = express.Router();

router.route('/').post(TrackingController.createTracking);
router.route('/:id').put(TrackingController.updateTrackingById);

module.exports = router;