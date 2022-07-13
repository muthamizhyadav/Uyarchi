const express = require('express');
const callHistoryController = require('../../controllers/b2b.callHistory.controller');
const router = express.Router();

router.route('/call').post(callHistoryController.createCallHistory);
router.route('/getCall').get(callHistoryController.getAll); 
router.route('/getShopId').get(callHistoryController.getShop);

module.exports = router;