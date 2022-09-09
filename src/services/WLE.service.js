const httpStatus = require('http-status');
const { ShopOrderClone } = require('../models/shopOrder.model');
const ApiError = require('../utils/ApiError');

const setPackedStatus_By_LoadingExecutice = async (body) => {
  const { arr } = body;
  arr.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate({ _id: e }, { status: 'Packed', completeStatus: 'Packed' }, { new: true });
  });
  return 'Packed Status Updated By Loading Executive';
};

module.exports = {
  setPackedStatus_By_LoadingExecutice,
};
