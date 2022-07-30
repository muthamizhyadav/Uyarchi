const express = require('express');
const receivedStockController = require('../../controllers/receivedStock.controller');
const router = express.Router();
router.route('/segrecation/:id').put(receivedStockController.updatesegrecation);
router.route('/:id').get(receivedStockController.getDataById).put(receivedStockController.updateReceivedStockById);
router.route('/getLoadedData/:id').get(receivedStockController.getDataByLoading);
router.route('/getData/withProduct/:productId/:date').get(receivedStockController.getDetailsByProductId);
module.exports = router;
