const express = require('express');
const supplierController = require('../../controllers/supplier.controller');
const router = express.Router();
router.route('/').post(supplierController.createSupplier).get(supplierController.getAllSupplier);

router.route('/:supplierId').get(supplierController.getSupplierById).put(supplierController.updateSupplierById).delete(supplierController.deleteSupplierById);
router.route('/enable/:supplierId').put(supplierController.recoverById);
router.route('/disable/All').get(supplierController.getAllDisableSupplier)
router.route('/disable/:id').get(supplierController.getDisableSupplierById).put(supplierController.updateDisableSupplierById)
router.route('/products/dealing/:id').get(supplierController.productDealingWithsupplier);
module.exports = router;
