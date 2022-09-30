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

module.exports = {
  register_shop,
  verify_otp,
  set_password,
  login_now,
  get_myDetails,
  get_myorder,
  change_password,
};
