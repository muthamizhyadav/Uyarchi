const express = require('express');
const TrendProductController = require('../../controllers/trend.product.controller');
const router = express.Router();

router
  .route('/getStreetByWardIdAndProducts/:wardId/:street/:date/:page')
  .get(TrendProductController.getStreetsByWardIdAndProducts);
router.route('/getProduct/:wardId/:street/:productId/:date').get(TrendProductController.getProductByProductIdFromTrendProduct);
module.exports = router;
