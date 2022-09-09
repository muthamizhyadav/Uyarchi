const httpStatus = require('http-status');
const { ShopOrderClone } = require('../models/shopOrder.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

const setPackedStatus_By_LoadingExecutice = async (body) => {
  const { arr } = body;
  arr.forEach(async (e) => {
    await ShopOrderClone.findByIdAndUpdate(
      { _id: e },
      { status: 'Packed', completeStatus: 'Packed', WL_Packed_Time: moment() },
      { new: true }
    );
  });
  return { message: 'Packed Status Updated By Loading Executive' };
};

module.exports = {
  setPackedStatus_By_LoadingExecutice,
};
