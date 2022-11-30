const express = require('express');
const supplierController = require('../../controllers/supplier.unBilled.controller');
const router = express.Router();

router.route('/').post(supplierController.createSupplierUnBilled)
router.route('/unBilled').get(supplierController.getUnBilledBySupplier)
module.exports = router