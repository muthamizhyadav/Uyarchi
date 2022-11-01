const express = require('express');
const BillAdjController = require('../../controllers/Bill.Adj.controller');

const router = express.Router();

// create Bill_Adjustment

router.route('/').post(BillAdjController.createBillAdj);
// get billAdjustment By Id
router.route('/:id').get(BillAdjController.getBillAdjustmentById);
router.route('/customer/pendingbills').get(BillAdjController.getCustomer_bills);

module.exports = router;
