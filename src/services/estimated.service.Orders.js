const httpStatus = require('http-status');
const Estimated = require('../models/estimatedOrders.mode');
const { ProductorderClone } = require('../models/shopOrder.model');
const ApiError = require('../utils/ApiError');

const createEstimatedOrders = async (body) => {
  let estimate = await Estimated.create(body);
  await ProductorderClone.updateMany({ productid: body.productId, date: body.date }, { $set: { preOrderClose: true } });
  return estimate;
};

const getEstimatedByDate = async (date, page) => {
  let values = await Estimated.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }],
      },
    },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
  ]);
  let total = await Estimated.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }],
      },
    },
  ]);

  return { values: values, total: total };
};

module.exports = { createEstimatedOrders, getEstimatedByDate };
