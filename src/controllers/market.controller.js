const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const marketService = require('../services/market.service');

const createmarketService = catchAsync(async (req, res) => {
  const pro = await marketService.createmarket(req.body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = "images/market/"+files.filename;
    });
    pro.image = path;
  }
  res.status(httpStatus.CREATED)
  res.send(pro);
  await pro.save();
});

const createmarketShopService = catchAsync(async (req, res) => {
  const pro = await marketService.createMarketShops(req.body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = "images/marketShop/"+files.filename;
    });
    pro.image = path;
  }
  res.status(httpStatus.CREATED).send(pro);
  await pro.save();
});


const getmarketServiceById = catchAsync(async (req, res) => {
  const pro = await marketService.getmarketById(req.params.marketId);
  if (!pro || pro.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'market not found');
  }
  res.send(pro);
});

const getmarketServiceAll = catchAsync(async (req, res) => {
    const manage = await marketService.getAllmarket(req.params);
    if (!manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'marketService Not Available ');
    }
    res.send(manage);
  });

const updatemarketService = catchAsync(async (req, res) => {
  const pro = await marketService.updatemarketById(req.params.marketId, req.body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = "images/"+files.filename;
    });
    pro.image = path;
  }
  res.send(pro)
  await pro.save();
});

const deletemarketService = catchAsync(async (req, res) => {
  await marketService.deletemarketById(req.params.marketId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
    createmarketService,
  getmarketServiceAll,
  updatemarketService,
  deletemarketService,
  getmarketServiceById,
  createmarketShopService
};