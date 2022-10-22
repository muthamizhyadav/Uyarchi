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
router.route('/get/shop/pending/:id').get(creditBillController.getShopPendingByPassingShopId);
router.route('/get/getDeliDetails').get(creditBillController.getDeliDetails);
router.route('/get/getFineAccount/:id').get(creditBillController.getFineAccount);
router.route('/get/deliveryExecutiveNmae').get(creditBillController.getDeliveryExecutiveName);
router.route('/get/details/Group/:id').get(creditBillController.getgetGroupAndBill);
router.route('/get/payment/overAll/:id').get(creditBillController.getPaymentTypeCount);
router.route('/get/group/data/:id').get(creditBillController.GroupDetails);
router.route('/submit/Dispute/:id').put(creditBillController.submitDispute);

module.exports = router;