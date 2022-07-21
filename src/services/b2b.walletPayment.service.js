const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const walletPaymentModel = require('../models/b2b.walletPayment.model');

const createWalletPayment = async (walletPaymentbody) => {
  let walletPayment = await walletPaymentModel.create(walletPaymentbody);
 
  return walletPayment;
};

module.exports={
    createWalletPayment,

}