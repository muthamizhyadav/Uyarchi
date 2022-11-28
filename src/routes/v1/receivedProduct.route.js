const express = require('express');
const receivedProductController = require('../../controllers/receivedProduct.Controller');
const router = express.Router();
const receivedproductimage = require('../../middlewares/receivedproductimage');

router.route('/').post(receivedProductController.createReceivedProduct);

router.route('/getAll/:page').get(receivedProductController.getAllWithPagination);
router.route('/getloaded/:page').get(receivedProductController.getAllWithPagination_loaded);
router.route('/getbilled/:page').get(receivedProductController.getAllWithPagination_billed);
router.route('/getbilled/supplier/:id').get(receivedProductController.getAllWithPagination_billed_supplier);
router
  .route('/:id')
  .put(receivedProductController.updateReceivedProduct)
  .delete(receivedProductController.deleteReceivedOrdersById);
router.route('/BillNumber/:id').put(receivedProductController.BillNumber);
router.route('/getSupplierBills/:filter/:page').get(receivedProductController.getSupplierBillsDetails);
router
  .route('/upload/image/:id')
  .put(
    receivedproductimage.fields([{ name: 'weighBridgeBillImg' }, { name: 'supplierBillImg' }]),
    receivedProductController.uploadImageById
  );
router.route('/getproducts/BySupplier/:page').get(receivedProductController.getreceivedProductBySupplier);
router.route('/supplierDetail/byGroup/:id').get(receivedProductController.getSupplierDetailByGroupId);


router.route('/updaterandom/product').post(receivedProductController.updaterandom_product);
router.route('/getSupplierBillsDetails1/:page').get(receivedProductController.getSupplierBillsDetails1);

module.exports = router;
