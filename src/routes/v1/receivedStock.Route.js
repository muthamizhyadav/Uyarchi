const express = require('express');
const receivedStockController = require('../../controllers/receivedStock.controller');
const router = express.Router();

router.route('/:id').get(receivedStockController.getDataById).put(receivedStockController.updateReceivedStockById);
router.route('/getLoadedData/:id').get(receivedStockController.getDataByLoading);
module.exports = router;
