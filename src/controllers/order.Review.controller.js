const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const OrderReviewService = require('../services/orderReview.service');

const createOrderReview = catchAsync(async (req, res) => {
  const data = await OrderReviewService.createOrderReview(req.body);
  res.send(data);
});

const getAllReview = catchAsync(async (req, res) => {
  const data = await OrderReviewService.getAllReview();
  res.send(data);
});

module.exports = {
  createOrderReview,
  getAllReview,
};
