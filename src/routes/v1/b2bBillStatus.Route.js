const express = require('express');
const b2bbillStatusController = require('../../controllers/B2bBillStatus.Controller');
const router = express.Router();

router.route('/').post(b2bbillStatusController.createB2bBillStatus);
router.route('/:page').get(b2bbillStatusController.getDataForAccountExecutive);
router.route('/:id').put(b2bbillStatusController.ManageDeliveryExpenseBillEntry);
module.exports = router;
