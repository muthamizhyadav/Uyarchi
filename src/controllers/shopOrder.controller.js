const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const { shopOrderService } = require('../services');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');

const createshopOrder = catchAsync(async (req, res) => {
  let userid = req.userId;
  const shopOrder = await shopOrderService.createshopOrder(req.body, userid);
  if (!shopOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shopOrder Not Fount.');
  }
  res.status(httpStatus.CREATED).send(shopOrder);
});

const createshopOrderClone = catchAsync(async (req, res) => {
  let userid = req.userId;
  const shopOrderClone = await shopOrderService.createshopOrderClone(req.body, userid);
  res.send(shopOrderClone);
});

const getAllShopOrderClone = catchAsync(async (req, res) => {
  const shopOrderClone = await shopOrderService.getAllShopOrderClone(req.params.date, req.params.page);
  res.send(shopOrderClone);
});

const getShopOrderCloneById = catchAsync(async (req, res) => {
  const shopOrderClone = await shopOrderService.getShopOrderCloneById(req.params.id);
  if (!shopOrderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  res.send(shopOrderClone[0]);
});

const updateShopOrderCloneById = catchAsync(async (req, res) => {
  const shopOrderClone = await shopOrderService.updateShopOrderCloneById(req.params.id, req.body);
  res.send(shopOrderClone);
});

const deleteShopOrderCloneById = catchAsync(async (req, res) => {
  const shopOrderClone = await shopOrderService.deleteShopOrderCloneById(req.params.id);
  res.send(shopOrderClone);
});

// productOrderClone Controller

const createsPrductOrderClone = catchAsync(async (req, res) => {
  const productOrderClone = await shopOrderService.createProductOrderClone(req.body);
  res.send(productOrderClone);
});

const getAllProductOrderClone = catchAsync(async (req, res) => {
  const productOrderClone = await shopOrderService.getAllProductOrderClone();
  res.send(productOrderClone);
});

const getProductOrderCloneById = catchAsync(async (req, res) => {
  const productOrderClone = await shopOrderService.getProductOrderCloneById(req.params.id);
  res.send(productOrderClone);
});

const updateProductOrderCloneById = catchAsync(async (req, res) => {
  const productOrderClone = await shopOrderService.updateProductOrderCloneById(req.params.id, req.body);
  res.send(productOrderClone);
});

const deleteProductOrderCloneById = catchAsync(async (req, res) => {
  const productOrderClone = await shopOrderService.deleteProductOrderClone(req.params.id);
  res.send(productOrderClone);
});

const getShopNameWithPagination = catchAsync(async (req, res) => {
  let user = req.userId;
  const shopOrder = await shopOrderService.getShopNameWithPagination(req.params.page, user);
  res.send(shopOrder);
});

const getShopNameCloneWithPagination = catchAsync(async (req, res) => {
  let user = req.userId;
  console.log(user);
  const shopOrder = await shopOrderService.getShopNameCloneWithPagination(req.params.page, user);
  res.send(shopOrder);
});

const getProductDetailsByProductId = catchAsync(async (req, res) => {
  const shopOrder = await shopOrderService.getProductDetailsByProductId(req.params.id);
  res.send(shopOrder);
});

const getAllShopOrder = catchAsync(async (req, res) => {
  let UserRole = req.userRole;
  console.log(UserRole);
  const shoporder = await shopOrderService.getAllShopOrder(UserRole);
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

const getAll = catchAsync(async (req, res) => {
  const telecaller = await shopOrderService.getAll();
  res.send(telecaller);
});

const createOrderId = catchAsync(async (req, res) => {
  const Buy = await ShopOrderClone.find({ date: currentDate }).count();
  let center = '';
  // console.log(Buy.length);
  if (Buy < 9) {
    center = '00000';
  }
  if (Buy < 99 && Buy >= 9) {
    center = '0000';
  }
  if (Buy < 999 && Buy >= 99) {
    center = '000';
  }
  if (Buy < 9999 && Buy >= 999) {
    center = '00';
  }
  if (Buy < 99999 && Buy >= 9999) {
    center = '0';
  }
  // console.log(center, 0);
  let userId = '';
  let totalcount = Buy + 1;

  userId = 'OD' + center + totalcount;

  let supplierss;
  if (userId != '') {
    supplierss = await shopOrderService.createOrderId(req.body);
  }
  console.log(userId);
  supplierss.OrderId = userId;
  console.log(supplierss);
  // console.log(supplierss)
  res.status(httpStatus.CREATED).send(supplierss);
  await supplierss.save();
});

const updateshop_order = catchAsync(async (req, res) => {
  const data = await shopOrderService.updateshop_order(req.params.id, req.body);
  res.send(data);
});

const getShopDetailsByOrder = catchAsync(async (req, res) => {
  const shopOrdes = await shopOrderService.getShopDetailsByOrder(req.params.id);
  res.send(shopOrdes);
});

const B2BManageOrders = catchAsync(async (req, res) => {
  const shoporders = await shopOrderService.B2BManageOrders(req.params.shopid);
  res.send(shoporders);
});

const getManageordersByOrderId = catchAsync(async (req, res) => {
  let userId = req.userId;
  const shopOrder = await shopOrderService.getManageordersByOrderId(req.params.orderId, req.params.date, userId);
  res.send(shopOrder);
});

module.exports = {
  createshopOrder,
  getAllShopOrder,
  getShopOrderById,
  getShopNameWithPagination,
  updateshopOrderById,
  getProductDetailsByProductId,
  deleteShopOrderById,

  // shopOrderClone Controllers
  createshopOrderClone,
  getAllShopOrderClone,
  getShopOrderCloneById,
  updateShopOrderCloneById,
  deleteShopOrderCloneById,

  // productOrderClone
  getShopNameCloneWithPagination,
  createsPrductOrderClone,
  getAllProductOrderClone,
  getProductOrderCloneById,
  updateProductOrderCloneById,
  deleteProductOrderCloneById,

  // Telecaller
  getAll,
  updateshop_order,
  createOrderId,
  getShopDetailsByOrder,
  B2BManageOrders,
  getManageordersByOrderId,
};
