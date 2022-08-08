const express = require('express');
const callHistoryController = require('../../controllers/b2b.callHistory.controller');

const router = express.Router();
const authorization = require('../../controllers/tokenVerify.controller');

router.route('/call').post(authorization, callHistoryController.createCallHistory);
router.route('/getAll/CallHistory').get(callHistoryController.getAll);
// router.route('/getShopId').get(callHistoryController.getShop);
router.route('/getAll/callHistory/:date/:page').get(authorization, callHistoryController.getAllPage);
router.route('/update/callingStatus/:id').put(authorization, callHistoryController.updateCallingStatus);
router.route('/update/StatusCall/:id').put(callHistoryController.updateStatuscall);
router.route('/getCallCount/:id').get(callHistoryController.getById);
router.route('/createByOwner/shop').post(callHistoryController.createShopByOwner);
router.route('/callHistory/report/callingStatus').get(callHistoryController.callingStatusreport);
router.route('/craeteCallStatus').post(callHistoryController.createcallHistoryWithTypes);
router.route('/craeteCallStatus').post(authorization, callHistoryController.createcallHistoryWithTypes);
router.route('/updateOrderedStatus/:id').put(callHistoryController.updateOrderedStatus);
router.route('/oncallcheck').get(authorization, callHistoryController.getOncallfromshops);
router.route('/callingStatus/:id').get(callHistoryController.checkvisitOncallStatus);
router.route('/uupdate/callingStatus/visit/:id').put(authorization, callHistoryController.updateStatuscallVisit);
module.exports = router;
