const express = require('express');
const usableStockController = require('../../controllers/usableStock.controller');
const router = express.Router();

router.route('/').post(usableStockController.createUsableStock).get(usableStockController.getAllUsableStock);

router.route('/:id').get(usableStockController.getUsableStockById).put(usableStockController.createUsableStock);
router.route('/assign/:id').get(usableStockController.getAssignStockbyId);
module.exports = router;
