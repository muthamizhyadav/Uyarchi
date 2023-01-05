const express = require('express');
const router = express.Router();
const shopregister = require('../../controllers/shopregister.controller');
const shopverify = require('../../controllers/shoptokenverify.controller');

router.route('/getmyorders/vieworder').get(shopverify, shopregister.getmyorder_byId);
router.route('/regiter').post(shopregister.register_shop);
router.route('/forget').post(shopregister.forget_password);
router.route('/verify').post(shopregister.verify_otp);
router.route('/setpassword').post(shopregister.set_password);
router.route('/changepassword').post(shopverify, shopregister.change_password);
router.route('/login').post(shopregister.login_now);
router.route('/mydetails').get(shopverify, shopregister.get_myDetails);
router.route('/myorder').get(shopverify, shopregister.get_myorder);
router.route('/mypayments').get(shopverify, shopregister.get_mypayments);
router.route('/mypayments/history/:id').get(shopverify, shopregister.getpayment_history);
router.route('/orderPending/amount/:id').get(shopverify, shopregister.get_pendung_amount);
router.route('/orderamount/collect').post(shopverify, shopregister.get_orderamount);
router.route('/raiseonissue/order/all').get(shopverify, shopregister.get_raiseonissue);
router.route('/raiseorder/issue/:id').get(shopverify, shopregister.get_raiseorder_issue);
router.route('/raiseproduct/issue/:id').put(shopverify, shopregister.get_raiseproduct);
router.route('/myissues/get/all').get(shopverify, shopregister.get_myissues);
router.route('/myissues/issue/:id').get(shopverify, shopregister.get_my_issue_byorder);
router.route('/cancel/order/bycustomer').get(shopverify, shopregister.cancelorder_byshop);
router.route('/cancel/byorder').put(shopverify, shopregister.cancelbyorder);




module.exports = router;
