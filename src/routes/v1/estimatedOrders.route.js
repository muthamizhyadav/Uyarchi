const { Router } = require('express');
const express = require('express');
const estimateOrderController = require('../../controllers/estimatedOrders.controller');
const router = express.Router();

router.route('/').post(estimateOrderController.createEstimatedOrders);

module.exports = router;
