const express = require('express');
const managePickupController = require('../../controllers/manage.pickup.location.controller');
const router = express.Router();
const pickup = require('../../middlewares/pickup');

router.route('/').post(pickup.array('photoCapture'),
 managePickupController.createManagePickupLocation);

module.exports = router;
