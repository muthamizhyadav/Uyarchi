const express = require('express');
const supplierBuyerController = require('../../controllers/supplierBuyer.controller');
const router = express.Router();
router.route('/').post(supplierBuyerController.createSupplierService).get(supplierBuyerController.getAllSupplierBuyerService);

router
  .route('/:supplierBuyerId')
  .get(supplierBuyerController.getSupplierBuyerByIdService)
  .put(supplierBuyerController.updateSupplierBuyerByIdService)
  .delete(supplierBuyerController.deleteSupplierBuyerByIdService);

module.exports = router;