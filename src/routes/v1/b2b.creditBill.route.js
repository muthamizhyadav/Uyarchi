const express = require('express');
const creditBillController = require('../../controllers/b2b.creditBill.controller');

const router = express.Router();

router.route( '/get/getShopWithBill').get(creditBillController.getShopWithBill);
router.route('/get/wardAdmin/delivery/ExecutiveName').get(creditBillController.getWardExecutiveName);
router.route('/get/wardAdmin/salesMAn/name').get(creditBillController.getsalesmanName);
router.route( '/get/shop/hostory/detatisl/:id').get(creditBillController.getShopHistory);
router.route('/put/creditBill/status/assigned/:id').put(creditBillController.updateAssignedStatusPerBill);
router.route('/post/creditBill/details/create').post(creditBillController.createGroupcredit);
router.route('/put/payingCash/with/DE/SM/:id').put(creditBillController.payingCAshWithDEorSM);

module.exports = router;