const express = require('express');
const videoController = require('../../controllers/videoUpload.controller');
const router = express.Router();
const middlware = require('../../middlewares/video');

router.route('/').post(middlware.array('video'), videoController.createVideoUpload);
router.route('/:id').get(videoController.getvideoByShopId);
module.exports = router;
