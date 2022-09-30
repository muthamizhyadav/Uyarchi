const express = require('express');
const destroyStockController = require('../../controllers/destoryStock.controller');
const router = express.Router();

router.route('/get/productNAme/fromRandomStock').get(destroyStockController.getProductNAmeFromRandom);


module.exports = router;