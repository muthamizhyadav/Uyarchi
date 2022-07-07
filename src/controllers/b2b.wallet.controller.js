const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const walletService = require('../services/b2b.walletAccount.service');
const httpStatus = require('http-status');

const createWalletAccount = catchAsync(async (req, res) => {
  const wallet = await walletService.createWallet(req.body);
  // console.log(wallet);
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
    await wallet.save();
    res.status(httpStatus.CREATED).send(wallet);
  }
});

const getAll = catchAsync(async (req, res) => {
  const wallet = await walletService.getAll();
  res.send(wallet);
});

const updateWallet = catchAsync(async (req, res) => {
  const wallet = await walletService.updateWallet(req.params.id, req.body)
  res.send(wallet)

})


const deleteWallet = catchAsync(async (req, res) => {
  const wallet = await walletService.deleteWalletById(req.params.id)
  res.send(wallet)
})


module.exports = {
  createWalletAccount,
  getAll,
  updateWallet,
  deleteWallet
};
