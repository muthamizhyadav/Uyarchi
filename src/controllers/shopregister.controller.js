const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const registerShop = require('../services/shopregister.service');
const tokenService = require('../services/token.service');

const register_shop = catchAsync(async (req, res) => {
  const shop = await registerShop.register_shop(req.body);
  res.status(httpStatus.CREATED).send(shop);
});

const verify_otp = catchAsync(async (req, res) => {
  const otp = await registerShop.verify_otp(req.body);
  res.status(httpStatus.CREATED).send(otp);
});

const set_password = catchAsync(async (req, res) => {
  const password = await registerShop.set_password(req.body);
  res.status(httpStatus.CREATED).send(password);
});

const change_password = catchAsync(async (req, res) => {
  const password = await registerShop.change_password(req.body, req.shopId);
  res.status(httpStatus.CREATED).send(password);
});

const login_now = catchAsync(async (req, res) => {
  const shop = await registerShop.login_now(req.body);
  const tokens = await tokenService.generateAuthTokens_shop(shop);

  res.status(httpStatus.CREATED).send(tokens);
});

const get_myDetails = catchAsync(async (req, res) => {
  const shop = await registerShop.get_myDetails(req);
  res.status(httpStatus.CREATED).send(shop);
});
const get_myorder = catchAsync(async (req, res) => {
  const shop = await registerShop.get_myorder(req);
  res.status(httpStatus.CREATED).send(shop);
});
const get_mypayments = catchAsync(async (req, res) => {
  const shop = await registerShop.get_mypayments(req);
  res.status(httpStatus.CREATED).send(shop);
});

const getpayment_history = catchAsync(async (req, res) => {
  const shop = await registerShop.getpayment_history(req.shopId, req.params.id);
  res.status(httpStatus.CREATED).send(shop);
});

const get_pendung_amount = catchAsync(async (req, res) => {
  const shop = await registerShop.get_pendung_amount(req.shopId, req.params.id);
  res.status(httpStatus.CREATED).send(shop);
});
const get_orderamount = catchAsync(async (req, res) => {
  const shop = await registerShop.get_orderamount(req.shopId, req.body);
  res.status(httpStatus.CREATED).send(shop);
});

module.exports = {
  register_shop,
  verify_otp,
  set_password,
  login_now,
  get_myDetails,
  get_myorder,
  change_password,
  get_mypayments,
  getpayment_history,
  get_pendung_amount,
  get_orderamount,
};
