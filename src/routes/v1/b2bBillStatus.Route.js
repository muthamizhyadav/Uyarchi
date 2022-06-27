const express = require('express');
const b2bbillStatusController = require('../../controllers/B2bBillStatus.Controller');
const router = express.Router();

router.route('/').post(b2bbillStatusController.createB2bBillStatus);
module.exports = router;
