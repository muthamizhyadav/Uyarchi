const express = require('express');
const walletController = require('../../controllers/b2b.wallet.controller');
const router = express.Router();
const wallet = require('../../middlewares/wallet');

router.route('/').post(wallet.fields([{ name: 'idProof'}, { name: 'addressProof'},{ name: 'twoWheelerUpload'}]),walletController.createWalletAccount);
router.route('/getAll').get(walletController.getAll);

module.exports = router;