const express = require('express');
const router = express.Router();
const shopOrderController = require('../../controllers/shopOrder.controller');
const authorization = require('../../controllers/tokenVerify.controller');

router
  .route('/')
  .post(authorization, shopOrderController.createshopOrder)
  .get(authorization, shopOrderController.getAllShopOrder);
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

router.route('/telecaller').get(shopOrderController.getAll);
router.route('/createorderId').post(shopOrderController.createOrderId);
router.route('/update/:id').put(authorization, shopOrderController.updateshop_order);
router.route('/getShop/details/:id').get(shopOrderController.getShopDetailsByOrder);
// data undelivered
router.route('/undelivered/data/:page').get(shopOrderController.undelivered);
router.route('/B2b/B2BManageOrders/:shopid').get(shopOrderController.B2BManageOrders);
router.route('/B2BManageOrders/:orderId/:date').get(shopOrderController.getManageordersByOrderId);
router.route('/productData/:id').get(shopOrderController.productData);
router.route('/productorders/:orderId').get(shopOrderController.getproductOrders_By_OrderId);
router.route('/getdata/lapster/yesterday/:page').get(shopOrderController.get_data_for_lapster);
router.route('/lapsed/getdata/:status/:page').get(authorization, shopOrderController.getLapsed_Data);
router.route('/lapsed/Reject/getdata/:status/:page').get(authorization, shopOrderController.getLapsed_Rejected);
router.route('/lapsed/Undelivered/getdata/:status/:page').get(authorization, shopOrderController.getLapsed_Undelivered);
router.route('/get/callhistory/last/ten/:shopId').get(shopOrderController.getCallhistories);
router.route('/singleShoprders/:id').get(shopOrderController.getFindbyId);
router.route('/lapsed/ordercount').get(shopOrderController.lapsedordercount);
router.route('/lapsed/ordercount/Reject').get(shopOrderController.lapsedordercountReject);
router.route('/lapsed/ordercount/Undelivered').get(shopOrderController.lapsedordercountUndelivered);
router.route('/getBills/byshop/:shopId').get(shopOrderController.getBills_ByShop);
router.route('/getBills/details/byshop/:shopId/:page').get(shopOrderController.getBills_DetailsByshop);
router.route('/vieworderbill/byshop/:shopId').get(authorization, shopOrderController.vieworderbill_byshop);
router.route('/mismatchstock/bygroup').post(shopOrderController.mismachstockscreate);

module.exports = router;
