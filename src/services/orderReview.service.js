const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const OrderReview = require('../models/orderReview.model');
const moment = require('moment');

const createOrderReview = async (shopId, body) => {
  let values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), shopId: shopId } };
  const createReview = await OrderReview.create(values);
  return createReview;
};

const getAllReview = async () => {
  let getreview = await OrderReview.find();
  return getreview;
};

module.exports = {
  createOrderReview,
  getAllReview,
};
