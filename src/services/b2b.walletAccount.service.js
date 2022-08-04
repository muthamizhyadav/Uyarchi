const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const walletModel = require('../models/b2b.walletAccount.model');
const { Shop } = require('../models/b2b.ShopClone.model')

const createWallet = async (walletbody) => {
  let wallet = await walletModel.create(walletbody);
  // console.log(wallet);
  return wallet;
};


const currentAmount = async (amountBody) => {
  let amount = await walletModel.create(amountBody);
  return amount;
};


const getshopName = async()=>{
  let shopname = await Shop.aggregate([

    {
      $project: {
        SName:1,
        mobile:1,
        address:1,
      }

    },

  ])
  return shopname;

}



const getAll = async () => {
  return walletModel.find();
};

const getWallet = async (page) =>{
  let wallet = await walletModel.aggregate([
     { $skip: 10 * page },
    { $limit: 10 },
    
  ]);
  let total = await walletModel.find().count();
    return {wallet : wallet , total:total};
  
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

  currentAmount,
  getshopName,
};
