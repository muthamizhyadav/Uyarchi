const httpStatus = require('http-status');
const Estimated = require('../models/estimatedOrders.mode');
const { ProductorderClone } = require('../models/shopOrder.model');
const ApiError = require('../utils/ApiError');

const createEstimatedOrders = async (body) => {
  let estimate = await Estimated.create(body);
  await ProductorderClone.updateMany({ productid: body.productId, date: body.date }, { $set: { preOrderClose: true } });
  return estimate;
};

module.exports = { createEstimatedOrders };
