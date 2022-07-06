const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const  walletModel  = require('../models/b2b.walletAccount.model');

const createWallet = async (walletbody)=>{
    return walletModel.create(walletbody);
}

const getAll = async () => {
    return walletModel.find();
  };
  
  module.exports = {
    createWallet,
    getAll,
  };