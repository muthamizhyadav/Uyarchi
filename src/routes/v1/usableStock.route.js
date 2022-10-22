const express = require('express');
const usableStockController = require('../../controllers/usableStock.controller');
const router = express.Router();

router.route('/').post(usableStockController.createUsableStock).get(usableStockController.getAllUsableStock);

router.route('/:id').get(usableStockController.getUsableStockById).put(usableStockController.createUsableStock);
router.route('/assign/:id').get(usableStockController.getAssignStockbyId);
router.route('/get/stocks').get(usableStockController.getStocks);
router.route('/getstockDetails/product/:id').get(usableStockController.getstockDetails);

module.exports = router;
