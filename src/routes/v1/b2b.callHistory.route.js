const express = require('express');
const callHistoryController = require('../../controllers/b2b.callHistory.controller');
const router = express.Router();
const authorization = require('../../controllers/tokenVerify.controller');

router.route('/call').post(authorization, callHistoryController.createCallHistory);
router.route('/getAll/CallHistory').get(callHistoryController.getAll);
// router.route('/getShopId').get(callHistoryController.getShop);
router.route('/getAll/callHistory/:page').get(authorization,callHistoryController.getAllPage);
router.route('/update/callingStatus/:id').put(authorization, callHistoryController.updateCallingStatus);
router.route('/update/StatusCall/:id').put(callHistoryController.updateStatuscall);
router.route('/getCallCount/:id').get(callHistoryController.getById);
router.route('/createByOwner/shop').post(callHistoryController.createShopByOwner);
router.route('/callHistory/report/callingStatus').get(callHistoryController.callingStatusreport);
router.route('/craeteCallStatus').post(authorization, callHistoryController.createcallHistoryWithTypes);

router.route('/updateOrderedStatus/:id').put(callHistoryController.updateOrderedStatus);

module.exports = router;
