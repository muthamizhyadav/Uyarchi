const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ReceivedStockService = require('../services/receivedStock.service');

const getDataById = catchAsync(async (req, res) => {
  const receivedStock = await ReceivedStockService.getDataById(req.params.id);
  res.send(receivedStock);
});

const updateReceivedStockById = catchAsync(async (req, res) => {
  const receivedStock = await ReceivedStockService.updateReceivedStockById(req.params.id, req.body);
  res.send(receivedStock);
});
const updatesegrecation = catchAsync(async (req, res) => {
  const receivedStock = await ReceivedStockService.updatesegrecation(req.params.id, req.body);
  res.send(receivedStock);
});

const getDataByLoading = catchAsync(async (req, res) => {
  const receivedStock = await ReceivedStockService.getDataByLoading(req.params.id);
  res.send(receivedStock);
});

const getDetailsByProductId = catchAsync(async (req, res) => {
  const receivedStock = await ReceivedStockService.getDetailsByProductId(req.params.productId, req.params.date);
  res.send(receivedStock);
});

module.exports = { getDataById, updateReceivedStockById, getDataByLoading, getDetailsByProductId, updatesegrecation };
