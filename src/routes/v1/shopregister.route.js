const express = require('express');
const router = express.Router();
const shopregister = require('../../controllers/shopregister.controller');
const authorization = require('../../controllers/tokenVerify.controller');
router.route('/regiter').post(shopregister.register_shop);
router.route('/verify').post(shopregister.verify_otp);
router.route('/setpassword').post(shopregister.set_password);

module.exports = router;
