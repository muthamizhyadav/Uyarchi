const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const b2bCloneService = require('../services/b2b.ShopClone.service');
const token = require('../services/token.service');
const { Shop } = require('../models/b2b.ShopClone.model');
// shop Clone Controller

const createB2bShopClone = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.createShopClone(req.body);
  const userId = req.userId;
  if (shop) {
    await Shop.findByIdAndUpdate({ _id: shop.id }, { Uid: userId }, { new: true });
  }
  if (req.files) {
    console.log(req.files);
    req.files.forEach(function (files, index, arr) {
      shop.photoCapture.push('images/shopClone/' + files.filename);
    });
  }
  res.send(shop);
  await shop.save();
});

const filterShopwithNameAndContact = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.filterShopwithNameAndContact(req.params.key);
  res.send(shop);
});

const getshopWardStreetNamesWithAggregation = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.getshopWardStreetNamesWithAggregation();
  res.send(shop);
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

// Attendance Controller

const creatAttendanceClone = catchAsync(async (req, res) => {
  const attendance = await b2bCloneService.createAttendanceClone(req.body);
  console.log(req.files);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      attendance.photoCapture.push('images/attandanceClone/' + files.filename);
    });
  }
  res.send(attendance);
  await attendance.save();
});

const getAlAttendanceClone = catchAsync(async (req, res) => {
  const attendance = await b2bCloneService.getAllAttendanceClone();
  res.send(attendance);
});

const getAttendanceById = catchAsync(async (req, res) => {
  const attendance = await b2bCloneService.getAttendanceById(req.params.id);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not Found');
  }
  res.send(attendance);
});

const updateAttendanceById = catchAsync(async (req, res) => {
  const attendance = await b2bCloneService.updateAttendanceById(req.params.id, req.params.body);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      attendance.photoCapture.push('images/shopClone/' + files.filename);
    });
  }
  res.send(attendance);
});

const deleteAttendanceById = catchAsync(async (req, res) => {
  const attendance = await b2bCloneService.deleteAttendanceById(req.params.id);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'attendance not Found');
  }
  res.send();
});

module.exports = {
  createB2bShopClone,
  getAllB2BshopClone,
  getB2BShopById,
  updateB2BShopById,
  deleteB2BShopById,
  filterShopwithNameAndContact,
  //Attendance Controller exports
  creatAttendanceClone,
  getAlAttendanceClone,
  getAttendanceById,
  getshopWardStreetNamesWithAggregation,
  updateAttendanceById,
  deleteAttendanceById,
};
