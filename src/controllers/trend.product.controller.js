const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const TrendProductService = require('../services/trend.product.service');

const getStreetsByWardIdAndProducts = catchAsync(async (req, res) => {
  const trendProduct = await TrendProductService.getStreetsByWardIdAndProducts(req.params.page);
  res.send(trendProduct);
});

module.exports = { getStreetsByWardIdAndProducts };
