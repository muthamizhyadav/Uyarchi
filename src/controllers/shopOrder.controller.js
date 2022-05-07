const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { shopOrderService } = require('../services');

const createshopOrder = catchAsync(async (req, res) => {
  const shopOrder = await shopOrderService.createshopOrder(req.body);
  if (!shopOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shopOrder Not Fount.');
  }
  res.status(httpStatus.CREATED).send(shopOrder);
});

const getProductDetailsByProductId = catchAsync(async (req, res)=>{
  const shopOrder = await shopOrderService.getProductDetailsByProductId(req.params.id)
  res.send(shopOrder)
})

const getAllShopOrder = catchAsync(async (req, res) => {
  const shoporder = await shopOrderService.getAllShopOrder();
  res.send(shoporder);
});

const getShopOrderById = catchAsync(async (req, res) => {
  const shoporder = await shopOrderService.getShopOrderById(req.params.shopOrderId);
  if (!shoporder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shoporder Not Found');
  }
  res.send(shoporder);
});

const updateshopOrderById = catchAsync(async (req, res) => {
  const shopOrder = await shopOrderService.updateShopOrderById(req.params.shopOrderId, req.body);
  res.send(shopOrder);
});

const deleteShopOrderById = catchAsync(async (req, res) => {
  await shopOrderService.deleteShopOrderById(req.params.shopOrderId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createshopOrder,
  getAllShopOrder,
  getShopOrderById,
  updateshopOrderById,
  getProductDetailsByProductId,
  deleteShopOrderById,
};
