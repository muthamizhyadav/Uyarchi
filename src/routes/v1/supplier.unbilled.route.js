const express = require('express');
const supplierController = require('../../controllers/supplier.unBilled.controller');
const router = express.Router();

router.route('/').post(supplierController.createSupplierUnBilled);
router.route('/unBilled').get(supplierController.getUnBilledBySupplier);
router.route('/advance/:supplierId').get(supplierController.getSupplierAdvance);
router.route('/ordered/details/:id').get(supplierController.getSupplierOrdered_Details);
router.route('/Unbilled/Details/bySupplier/:id').get(supplierController.Unbilled_Details_bySupplier);
router.route('/supplier/Bill/payments/:page').get(supplierController.getSupplierbill_amt);
router.route('/supplier/Bills/:id').get(supplierController.getBillDetails_bySupplier);
router.route('/supplier/amount/details/:id').get(supplierController.supplierOrders_amt_details);
module.exports = router;
