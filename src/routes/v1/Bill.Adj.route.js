const express = require('express');
const BillAdjController = require('../../controllers/Bill.Adj.controller');

const router = express.Router();

// create Bill_Adjustment

router.route('/').post(BillAdjController.createBillAdj);
// get billAdjustment By Id
router.route('/:id').get(BillAdjController.getBillAdjustmentById);
router.route('/customer/pendingbills/:page').get(BillAdjController.getCustomer_bills);
router.route('/adjustment/bill/:id').get(BillAdjController.adjustment_bill);

module.exports = router;
