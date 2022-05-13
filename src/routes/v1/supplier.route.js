const express = require('express');
const supplierController = require('../../controllers/supplier.controller');
const router = express.Router();
router.route('/').post(supplierController.createSupplier).get(supplierController.getAllSupplier);

router.route('/:supplierId').get(supplierController.getSupplierById).put(supplierController.updateSupplierById).delete(supplierController.deleteSupplierById);

module.exports = router;
