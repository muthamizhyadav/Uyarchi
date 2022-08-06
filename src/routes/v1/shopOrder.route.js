const express = require('express');
const router = express.Router();
const shopOrderController = require('../../controllers/shopOrder.controller');
const authorization = require('../../controllers/tokenVerify.controller');

router.route('/').post(authorization, shopOrderController.createshopOrder).get(authorization, shopOrderController.getAllShopOrder);
router
  .route('/:shopOrderId')
  .get(shopOrderController.getShopOrderById)
  .put(shopOrderController.updateshopOrderById)
  .delete(shopOrderController.deleteShopOrderById);

router.route('/product/all').get(shopOrderController.getProductDetailsByProductId);
router.route('/shopdata/pagination/:page').get(authorization, shopOrderController.getShopNameWithPagination);

// shopOrderClone Router
router
  .route('/shopOrderClone/pagination/shops/:page')
  .get(authorization, shopOrderController.getShopNameCloneWithPagination);
router.route('/ShopOrderClone').post(authorization, shopOrderController.createshopOrderClone);
router.route('/ShopOrderClone/All/:date/:page').get(authorization, shopOrderController.getAllShopOrderClone);
router
  .route('/shopOrderClone/:id')
  .get(authorization, shopOrderController.getShopOrderCloneById)
  .put(shopOrderController.updateShopOrderCloneById)
  .delete(shopOrderController.deleteShopOrderCloneById);

// ProductOrderClone Routes

router.route('/ProductOrderClone').post(shopOrderController.createsPrductOrderClone);
router.route('/ProductOrderClone/All').get(shopOrderController.getAllProductOrderClone);
router
  .route('/ProductOrderClone/:id')
  .get(shopOrderController.getProductOrderCloneById)
  .put(shopOrderController.updateProductOrderCloneById)
  .delete(shopOrderController.deleteProductOrderCloneById);


  router.route('/telecaller').get(shopOrderController.getAll)


  router.route('/createorderId').post(shopOrderController.createOrderId);
  module.exports = router;
