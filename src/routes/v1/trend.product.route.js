const express = require('express');
const TrendProductController = require('../../controllers/trend.product.controller')
const router = express.Router();

router.route('/getStreetByWardIdAndProducts/:date/:page').get(TrendProductController.getStreetsByWardIdAndProducts)

module.exports = router