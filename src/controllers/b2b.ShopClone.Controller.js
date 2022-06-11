const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const b2bCloneService = require('../services/b2b.ShopClone.service');
const token = require('../services/token.service');
const createB2bShopClone = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.createB2bShopClone(req.body);
  if (req.files) {
    console.log(req.files);
    req.files.forEach(function (files, index, arr) {
      shop.photoCapture.push('images/shopClone/' + files.filename);
    });
  }
  res.send(shop);
  await shop.save();
});

const getAllB2BshopClone = catchAsync(async (req, res) => {
  console.log(req.userRole);
  const shop = await b2bCloneService.getAllB2BshopClone();
  res.send(shop);
});

const getB2BShopById = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.getB2BShopById(req.params.id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not Found');
  }
  res.send(shop);
});

const updateB2BShopById = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.updateB2BShopById(req.params.id, req.params.body);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      shop.photoCapture.push('images/shopClone/' + files.filename);
    });
  }
  res.send(shop);
});

const deleteB2BShopById = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.deleteB2BShopById(req.params.id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not Found');
  }
  res.send();
});

module.exports = {
  createB2bShopClone,
  getAllB2BshopClone,
  getB2BShopById,
  updateB2BShopById,
  deleteB2BShopById,
};