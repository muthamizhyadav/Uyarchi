const express = require('express');
const creditBillController = require('../../controllers/b2b.creditBill.controller');

const router = express.Router();

router.route( '/get/getShopWithBill/:page').get(creditBillController.getShopWithBill);
router.route('/get/wardAdmin/delivery/ExecutiveName').get(creditBillController.getWardExecutiveName);
router.route('/get/wardAdmin/salesMAn/name').get(creditBillController.getsalesmanName);
router.route( '/get/shop/hostory/detatisl/:AssignedUserId/:date').get(creditBillController.getShopHistory);
router.route('/put/creditBill/status/assigned').put(creditBillController.updateAssignedStatusPerBill);
router.route('/post/creditBill/details/create').post(creditBillController.createGroupcredit);
router.route('/put/payingCash/with/DE/SM/:id').put(creditBillController.payingCAshWithDEorSM);
router.route('/get/getManageCreditBillAssigning/deliveryExecutivename').get(creditBillController.getManageCreditBillAssigning);
router.route('/get/details/getcreditBillDetailsByPassExecID/:id').get(creditBillController.getcreditBillDetailsByPassExecID);
router.route('/get/history/data/ByPassing/orderId/:id').get(creditBillController.getHistoryByPassOrderId);
router.route('/get/DelNmae/AfterAssign').get(creditBillController.getDElExecutiveName);
router.route('/get/salesman/name').get(creditBillController.getsalesName)
router.route('/get/data/notAssigned/:page').get(creditBillController.getNotAssignData);

module.exports = router;