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

router.route('/stocks').post(productController.createStock)
router.route('/stock/all').get(productController.getAllStock)
router.route('/suppliers/:supplierId').get(productController.getStockBySupplierId);
module.exports = router;
