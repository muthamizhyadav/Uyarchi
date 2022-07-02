const httpStatus = require('http-status');
const { ReceivedOrders } = require('../models');
const ApiError = require('../utils/ApiError');
const ReceivedProduct = require('../models/receivedProduct.model');

const createReceivedProduct = async (body) => {
  return 'hello';
};

const getAllWithPagination = async (page) => {
  return 'get';
};

const updateReceivedProduct = async (id, updateBody) => {
  return 'update';
};

const deleteReceivedProduct = async (id) => {
  return 'gg';
};

module.exports = {
  createReceivedProduct,
  getAllWithPagination,
  updateReceivedProduct,
  deleteReceivedProduct,
};
