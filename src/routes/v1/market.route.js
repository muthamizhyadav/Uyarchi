const express = require('express');
const marketController = require('../../controllers/market.controller');
const upload = require('../../middlewares/marketImage')
const marketUpload = require('../../middlewares/marketShopImage')

const router = express.Router();

router.route('/').post(upload.array('image'),marketController.createmarketService).get(marketController.getmarketServiceAll);
router.route('/marketShop').post(marketUpload.array('image'), marketController.createmarketShopService)

router
  .route('/:marketId')
  .get(marketController.getmarketServiceById)
  .delete(marketController.deletemarketService)
  .put(upload.array('image'),marketController.updatemarketService);
router.route('/:marketId/marketShopAll').get(marketController.getmarketShopAll)
router.route('/shop/:marketShopId').get(marketController.getmarketShopServiceById)
module.exports = router;