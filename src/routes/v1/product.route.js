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
module.exports = router;
