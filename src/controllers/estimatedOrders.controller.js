const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const EstimatedOrderService = require('../services/estimated.service.Orders');

const createEstimatedOrders = catchAsync(async (req, res) => {
  const estimate = await EstimatedOrderService.createEstimatedOrders(req.body);
  res.send(estimate);
});

module.exports = { createEstimatedOrders };
