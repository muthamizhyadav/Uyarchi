const express = require('express');
const router = express.Router();
const shopregister = require('../../controllers/shopregister.controller');
const shopverify = require('../../controllers/shoptokenverify.controller');

router.route('/regiter').post(shopregister.register_shop);
router.route('/verify').post(shopregister.verify_otp);
router.route('/setpassword').post(shopregister.set_password);
router.route('/changepassword').post(shopverify, shopregister.change_password);
router.route('/login').post(shopregister.login_now);
router.route('/mydetails').get(shopverify, shopregister.get_myDetails);
router.route('/myorder').get(shopverify, shopregister.get_myorder);
router.route('/mypayments').get(shopverify, shopregister.get_mypayments);

module.exports = router;
