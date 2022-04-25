const express = require('express');
const productController = require('../../controllers/product.controller');
const upload = require('../../middlewares/upload');
const router = express.Router();

router.route('/').post(upload.array('image'), productController.createProduct).get(productController.getProducts);
router
  .route('/:productId')
  .get(productController.getproduct)
  .delete(productController.deleteProduct)
  .put(productController.updateProduct);

router.route('/stocks').post(productController.createStock);
router.route('/stock/all').get(productController.getAllStock);
router.route('/suppliers/:supplierId').get(productController.getStockBySupplierId);
router.route('/confirmStock').post(productController.createConfirmStock);
router.route('/confirmStock/all').get(productController.getAllConfirmStock);
router.route('/stock/:id').put(productController.updateStockStatusById);
router.route('/sendData/:id').put(productController.sendStocktoLoadingExecute);
router.route('/stock/delivered').get(productController.getStocksByStatusDelivered);
router.route('/loadingExecute/all').get(productController.getLoadingExecuteDate);
router
  .route('/confirmStock/:confirmStockId')
  .get(productController.getconfirmStockById)
  .put(productController.updateConfirmStock)
  .delete(productController.deleteConfirmStockById);
router.route('/arrived/:id').put(productController.updateArrivedById);

router
  .route('/mwloadingExecute')
  .post(productController.createMainWherehouseLoadingExecute)
  router.route('/mwloadingExecute/all').get(productController.getAllMailWherehoustLoadingExecute);
router
  .route('/mwloadingExecutes/:mwLoadingId')
  .get(productController.getMailWherehoustLoadingExecuteById)
  .put(productController.updateMainWherehouseLoadingExecuteById)
  .delete(productController.deleteMainWherehouseLoadingExecuteById);

  router.route('/billRaise').post(productController.createBillRaise)
  router.route('/billRaise/All').get(productController.getAllBillRaised)
  router.route('/billRaise/:billRaiseId').get(productController.getBillRaiseById).put(productController.updateBillRaiseById).delete(productController.deleteConfirmStockById)

router.route('/manageBill').post(productController.createManageBill)
router.route('/managebill/all').get(productController.getAllManageBill)
router.route('/manageBill/:manageBillId').get(productController.getManageBillById).put(productController.updateManageBill).delete(productController.deleteBillManage);
router.route('/updateDelivered/:id').put(productController.updatingStatusForDelivered)

module.exports = router;
