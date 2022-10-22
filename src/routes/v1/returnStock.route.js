const express = require('express');
const returnStockController = require('../../controllers/returnStock.controller');
const router = express.Router();
const returnStockImage = require('../../middlewares/returnStock');

router.route('/').post(returnStockImage.array('image'), returnStockController.create_ReturnStock);
module.exports = router;
