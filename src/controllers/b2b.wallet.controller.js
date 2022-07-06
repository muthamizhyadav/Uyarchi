const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const walletService = require('../services/b2b.walletAccount.service');
const httpStatus = require('http-status');

const createWalletAccount = catchAsync(async (req, res) => {
  const wallet = await walletService.createWallet(req.body);
  if (req.files) {
    let path = '';
    path = 'images/wallet/';
    if (req.files.idProof != null) {
      wallet.idProof =
        path +
        req.files.idProof.map((e) => {
          return e.filename;
        });
    }
    if (req.files.addressProof != null) {
      wallet.addressProof =
        path +
        req.files.addressProof.map((e) => {
          return e.filename;
        });
    }
    res.status(httpStatus.CREATED).send(wallet);

    await wallet.save();
  }
});

const getAll = catchAsync(async (req, res) => {
  const wallet = await walletService.getAll();
  res.send(wallet);
});

module.exports = {
  createWalletAccount,
  getAll,
};
