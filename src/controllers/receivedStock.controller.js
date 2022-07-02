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

module.exports = { getDataById, updateReceivedStockById };
