const express = require('express');
const router = express.Router();
const WLE_Controller = require('../../controllers/WLE.controller');

router.route('/SetPackedStatus').post(WLE_Controller.setPackedStatus_By_LoadingExecutice);

module.exports = router;
