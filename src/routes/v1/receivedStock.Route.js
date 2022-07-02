const express = require('express');
const receivedStockController = require('../../controllers/receivedStock.controller');
const router = express.Router();

router.route('/:id').get(receivedStockController.getDataById);

module.exports = router;
