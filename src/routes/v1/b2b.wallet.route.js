const express = require('express');
const walletController = require('../../controllers/b2b.wallet.controller');
const router = express.Router();
const wallet = require('../../middlewares/wallet');

router.route('/').post(wallet.fields([{ name: 'idProof'}, { name: 'addressProof'}]),walletController.createWalletAccount);
router.route('/getAll').get(walletController.getAll);
router.route('/:id').put(walletController.updateWallet);
router.route('/:id').delete(walletController.deleteWallet);

module.exports = router;