const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ReceivedProductService = require('../services/receivedProduct.service');

const createReceivedProduct = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.createReceivedProduct(req.body);
  res.send(receivedProduct);
});

const getAllWithPagination = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.getAllWithPagination(req.params.page);
  res.send(receivedProduct);
});

const updateReceivedProduct = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.updateReceivedProduct(req.params.id, req.body);
  res.send(receivedProduct);
});

const deleteReceivedOrdersById = catchAsync(async (req, res) => {
  const receivedProduct = await ReceivedProductService.deleteReceivedOrdersById(req.params.id);
  res.send(receivedProduct);
});

module.exports = {
  createReceivedProduct,
  getAllWithPagination,
  updateReceivedProduct,
  deleteReceivedOrdersById,
};
