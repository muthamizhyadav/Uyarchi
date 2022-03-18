const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const CartManagementService = require('../services/cartManagement.service');

const createCartManagement = catchAsync(async (req, res) => {
  const { body } = req;
  const cart = await CartManagementService.createCartManagement(body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = path + files.path + ',';
    });
    path = path.substring(0, path.lastIndexOf(','));
    cart.image = path;
  }
  res.status(httpStatus.CREATED).send(cart);
  await cart.save();
});

const getCartManagementDetailsById = catchAsync(async (req, res) => {
  const cartManagement = await CartManagementService.getCartManagementById(req.params.cartManagementId);
  if (!cartManagement) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CartManagement_Details not found');
  }
  res.send(cartManagement);
});

const updateCartManagement = catchAsync(async (req, res) => {
  const cartManagement = await CartManagementService.updateCartManagementById(req.params.cartManagementId, req.body);
  res.send(cartManagement);
});

const deleteCartManagement = catchAsync(async (req, res) => {
  await CartManagementService.deleteCartManagementById(req.params.cartManagementId);
  res.status(httpStatus.NO_CONTENT).send();
});
  module.exports = {
    createCartManagement,
    getCartManagementDetailsById,
    updateCartManagement,
    deleteCartManagement,
  };