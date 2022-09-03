const express = require('express');
const managePickupController = require('../../controllers/manage.pickup.location.controller');
const router = express.Router();
const pickup = require('../../middlewares/pickup');
const authorization = require('../../controllers/tokenVerify.controller');
router.route('/').post(authorization, pickup.array('photoCapture'), managePickupController.createManagePickupLocation);

router.route('/getAll/:userId/:date/:page').get(managePickupController.getAllManagepickup);
router.route('/:id').get(managePickupController.getManagePickupById);

module.exports = router;
