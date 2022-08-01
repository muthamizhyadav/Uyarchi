const express = require('express');
const AssignStockController = require('../../controllers/AssignStock.contreller');
const router = express.Router();

router.route('/').post(AssignStockController.createAssignStock);

module.exports = router;
