const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const registerShop = require('../services/shopregister.service');

const register_shop = catchAsync(async (req, res) => {
  let userid = req.userId;
  const shop = await registerShop.register_shop(req.body);
  res.status(httpStatus.CREATED).send(shop);
});

module.exports = {
  register_shop,
};
