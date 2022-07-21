    const express = require('express');
    const walletPaymentController = require('../../controllers/b2b.walletPayment.controller');
    const router = express.Router();


    router.route('/createPayment').post(walletPaymentController.createWalletPayment);

    module.exports = router;