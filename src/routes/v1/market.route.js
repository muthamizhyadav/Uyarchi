const express = require('express');
const marketController = require('../../controllers/market.controller');
const upload = require('../../middlewares/marketImage')
const marketUpload = require('../../middlewares/marketShopImage')

const router = express.Router();

router.route('/').post(upload.array('image'),marketController.createmarketService).get(marketController.getmarketServiceAll);
router.route('/marketShop').post(marketUpload.array('image'), marketController.createmarketShopService)
router.route('/:id/:page').get(marketController.getAllMarketTable)
router
  .route('/:marketId')
  .get(marketController.getmarketServiceById)
  .delete(marketController.deletemarketService)
  .put(upload.array('image'),marketController.updatemarketService);
router.route('/shopsAll/all/all/:marketId/:page').get(marketController.getmarketShopAll)
router.route('/shop/:marketShopId/one').get(marketController.getmarketShopServiceById)
router.route('/shop/:marketShopId').put(marketUpload.array('image'), marketController.updatemarketShopService)
module.exports = router;