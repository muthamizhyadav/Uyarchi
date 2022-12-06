const express = require('express');
const supplierController = require('../../controllers/supplier.controller');
const auth = require('../../controllers/supplierAppAuth.controller');
const router = express.Router();
router.route('/').post(supplierController.createSupplier).get(supplierController.getAllSupplier);

// appSupplier
router.route('/login').post(supplierController.UsersLogin)
router.route('/otp_verify').post(supplierController.otpVerify_Setpassword)
router.route('/Supplier_setPassword/:id').put(supplierController.Supplier_setPassword)
router.route('/forgotPassword').post(supplierController.forgotPassword)
router.route('/getAppSupplier').get(auth, supplierController.getAllAppSupplier);

router
  .route('/:supplierId')
  .get(supplierController.getSupplierById)
  .put(supplierController.updateSupplierById)
  .delete(supplierController.deleteSupplierById);
router.route('/enable/:supplierId').put(supplierController.recoverById);
router.route('/disable/All').get(supplierController.getAllDisableSupplier);
router
  .route('/disable/:id')
  .get(supplierController.getDisableSupplierById)
  .put(supplierController.updateDisableSupplierById);
router.route('/products/dealing/:id/').get(supplierController.productDealingWithsupplier);
router.route('/dealing/:date').get(supplierController.getSupplierWithApprovedstatus);
router.route('/product/supplier/:supplierId/:date').get(supplierController.getproductsWithSupplierId);
router.route('/products/aggregate/:date').get(supplierController.getproductfromCallStatus);
router.route('/supplierPendingAmounts/:page').get(supplierController.getSupplierAmountDetailsForSupplierBills);
router.route('/supplier/paymend/details/:id').get(supplierController.getSupplierPaymentDetailsBySupplierId);
router.route('/productData/:id').get(supplierController.getSupplierPaymentDetailsByProductId);
router.route('/getSupplierWith/Advanced').get(supplierController.getSupplierWith_Advanced)
module.exports = router;
