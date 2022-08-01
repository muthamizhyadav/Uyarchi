const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const usableStockService = require('../services/usable.service');

const createUsableStock = catchAsync(async (req, res) => {
  const usable = await usableStockService.createUsableStock(req.body);
  res.send(usable);
});

const getAllUsableStock = catchAsync(async (req, res) => {
  const usable = await usableStockService.getAllUsableStock();
  res.send(usable);
});

const getUsableStockById = catchAsync(async (req, res) => {
  const usable = await usableStockService.getUsableStockById(req.params.id);
  res.send(usable);
});

const updateUsableStockbyId = catchAsync(async (req, res) => {
  const usable = await usableStockService.updateUsableStockbyId(req.params.id, req.body);
  res.send(usable);
});
const getAssignStockbyId = catchAsync(async (req, res) => {
  const usable = await usableStockService.getAssignStockbyId(req.params.id);
  res.send(usable);
});
module.exports = {
  createUsableStock,
  getAllUsableStock,
  getUsableStockById,
  updateUsableStockbyId,
  getAssignStockbyId,
};
