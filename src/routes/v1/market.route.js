const express = require('express');
const marketController = require('../../controllers/market.controller');
const upload = require('../../middlewares/marketImage');
const marketImage = require('../../middlewares/marketClone');
const marketUpload = require('../../middlewares/marketShopImage');
const authorization = require('../../controllers/tokenVerify.controller');
const router = express.Router();

router
  .route('/')
  .post(upload.array('image'), marketController.createmarketService)
  .get(marketController.getmarketServiceAll);
router.route('/marketShop').post(marketUpload.array('image'), marketController.createmarketShopService);
router.route('/:id/:page').get(marketController.getAllMarketTable);
router
  .route('/:marketId')
  .get(marketController.getmarketServiceById)
  .delete(marketController.deletemarketService)
  .put(upload.array('image'), marketController.updatemarketService);
router.route('/shopsAll/all/all/:marketId/:page').get(marketController.getmarketShopAll);
router.route('/shop/:marketShopId/one').get(marketController.getmarketShopServiceById);
router.route('/shop/:marketShopId').put(marketUpload.array('image'), marketController.updatemarketShopService);

// market Clone

router.route('/marketClone').post(authorization,marketImage.array('image'), marketController.createmarketCloneService);
router.route('/marketClone/all/clone').get(authorizationmarketController.getmarketCloneAll);
router.route('/marketClone/getOne/:id')
  .get(marketController.getmarketCloneById)
  .put(marketController.updatemarketClone)
  .delete(marketController.updatemarketClone);

module.exports = router;
