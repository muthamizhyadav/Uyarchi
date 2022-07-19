const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const walletModel = require('../models/b2b.walletAccount.model');

const createWallet = async (walletbody) => {
  let wallet = await walletModel.create(walletbody);
  // console.log(wallet);
  return wallet;
};

const getAll = async () => {
  return walletModel.find();
};

const getWallet = async (page) =>{
  let wallet = await walletModel.aggregate([
     { $skip: 10 * page },
    { $limit: 10 },
  ]);
  return wallet;
}

const updateWallet = async (id, walletbody) => {
  let wallet = await walletModel.findById(id);
  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wallet Not found');
  }
  wallet = await walletModel.findByIdAndUpdate({ _id: id }, walletbody, { new: true });
  return wallet;
};

const deleteWalletById = async (id) => {
  let wallet = await walletModel.findById(id);
  if (!wallet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wallet Not found');
  }

  wallet.active = false;
  await wallet.save();
};

module.exports = {
  createWallet,
  getAll,
  updateWallet,
  deleteWalletById,
  getWallet,
};
