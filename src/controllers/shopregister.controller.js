const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const registerShop = require('../services/shopregister.service');

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

module.exports = {
  register_shop,
  verify_otp,
  set_password,
};
