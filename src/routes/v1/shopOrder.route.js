const express = require('express');
const router = express.Router();
const shopOrderController = require('../../controllers/shopOrder.controller');

router.route('/').post(shopOrderController.createshopOrder).get(shopOrderController.getAllShopOrder);
router
  .route('/:shopOrderId')
  .get(shopOrderController.getShopOrderById)
  .put(shopOrderController.updateshopOrderById)
  .delete(shopOrderController.deleteShopOrderById);

router.route('/product/all').get(shopOrderController.getProductDetailsByProductId);

module.exports = router;
