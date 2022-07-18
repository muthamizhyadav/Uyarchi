const express = require('express');
const callHistoryController = require('../../controllers/b2b.callHistory.controller');
const router = express.Router();
const authorization = require('../../controllers/tokenVerify.controller');

router.route('/call').post(callHistoryController.createCallHistory);
router.route('/getAll/CallHistory').get(callHistoryController.getAll);
// router.route('/getShopId').get(callHistoryController.getShop);
router.route('/getAll/callHistory/:page').get(callHistoryController.getAllPage);
router.route('/update/callingStatus/:id').put(authorization, callHistoryController.updateCallingStatus);
router.route('/update/StatusCall/:id').put(callHistoryController.updateStatuscall);
router.route('/getCallCount/:id').get(callHistoryController.getById);
router.route('/createByOwner/shop').post(callHistoryController.createShopByOwner);

router.route('/craeteCallStatus').post(callHistoryController.createcallHistoryWithTypes);

module.exports = router;
