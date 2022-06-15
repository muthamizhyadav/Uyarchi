const express = require('express');
const router = express.Router();
const shopOrderController = require('../../controllers/shopOrder.controller');
const authorization = require('../../controllers/tokenVerify.controller');


router.route('/').post(authorization,shopOrderController.createshopOrder).get(shopOrderController.getAllShopOrder);
router
  .route('/:shopOrderId')
  .get(shopOrderController.getShopOrderById)
  .put(shopOrderController.updateshopOrderById)
  .delete(shopOrderController.deleteShopOrderById);

router.route('/product/all').get(shopOrderController.getProductDetailsByProductId);
router.route('/shopdata/pagination/:page').get(authorization,shopOrderController.getShopNameWithPagination);
module.exports = router;
