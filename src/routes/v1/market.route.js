const express = require('express');
const marketController = require('../../controllers/market.controller');
const upload = require('../../middlewares/marketImage')

const router = express.Router();

router.route('/').post(upload.array('image'),marketController.createmarketService).get(marketController.getmarketServiceAll);
router
  .route('/:marketId')
  .get(marketController.getmarketServiceById)
  .delete(marketController.deletemarketService)
  .put(upload.array('image'),marketController.updatemarketService);

module.exports = router;