const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const b2bCloneService = require('../services/b2b.ShopClone.service');
const token = require('../services/token.service');
const { Shop } = require('../models/b2b.ShopClone.model');

const { MarketClone } = require('../models/market.model');
const createB2bShopClone = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.createShopClone(req.body);
  const userId = req.userId;
  let marketId = req.body.marketId;
  if (shop) {
    let bodydata = { Uid: userId };
    if (req.body.type == 'market') {
      let marketdata = await MarketClone.findById(marketId);
      if (marketdata) {
        bodydata = { Uid: userId, Strid: marketdata.Strid, Wardid: marketdata.Wardid };
      }
    }
    await Shop.findByIdAndUpdate({ _id: shop.id }, bodydata, { new: true });
  }
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      shop.photoCapture.push('images/shopClone/' + files.filename);
    });
  }

  res.send(shop);
  await shop.save();
});

// register user

const registerUser = catchAsync(async (req, res) => {
  const register = await b2bCloneService.craeteRegister(req.body);
  res.send(register);
});

const filterShopwithNameAndContact = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.filterShopwithNameAndContact(req.params.key);
  res.send(shop);
});

const getshopWardStreetNamesWithAggregation = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.getshopWardStreetNamesWithAggregation(req.params.page);
  res.send(shop);
});

const getAllB2BshopClone = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.getAllShopClone();
  res.send(shop);
});

const getStreetAndShopDetails = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.getStreetAndShopDetails(req.params.id);
  res.send(shop);
});

const getB2BShopById = catchAsync(async (req, res) => {
  const shop = await b2bCloneService.getShopById(req.params.id);
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
  attendance.Uid = req.userId;
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
  const attendance = await b2bCloneService.getAllAttendanceClone(
    req.params.id,
    req.params.date,
    req.params.fromtime,
    req.params.totime,
    req.params.page
  );
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

const getTotalCounts = catchAsync(async (req, res) => {
  let userId = req.userId;
  const attendance = await b2bCloneService.totalCount(userId);
  res.send(attendance);
});

const getMarkeShop = catchAsync(async (req, res) => {
  const marketshop = await b2bCloneService.getMarkeShop(req.params.marketId, req.params.page);
  if (!marketshop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not Found');
  }
  res.send(marketshop);
});
const forgotPassword = catchAsync(async (req, res) => {
  const users = await b2bCloneService.forgotPassword(req.body);
  res.send(users);
});
const verfiOtp = catchAsync(async (req, res) => {
  const users = await b2bCloneService.otpVerfiy(req.body);
  res.send(users);
});

const verifyRegisterOTP = catchAsync(async (req, res) => {
  const users = await b2bCloneService.verifyRegisterOTP(req.body);
  res.send(users);
});

const getAllAttendanceCloneforMapView = catchAsync(async (req, res) => {
  const users = await b2bCloneService.getAllAttendanceCloneforMapView(
    req.params.id,
    req.params.date,
    req.params.fromtime,
    req.params.totime
  );
  res.send(users);
});

const updateShopStatusdataapproved = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.updateShopStatus(req.params.id, 'data_approved');
  res.send(shops);
});

const updateShopStatusphoneapproved = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.updateShopStatus(req.params.id, 'phone_approved');
  res.send(shops);
});

const updateShopStatuskycapproved = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.updateShopStatus(req.params.id, 'kyc_verified');
  res.send(shops);
});

const getshopDataById = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.getshopDataById(req.params.id);
  res.send(shops);
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
  getTotalCounts,
  // getmaketShop
  getMarkeShop,
  registerUser,
  forgotPassword,
  verfiOtp,
  verifyRegisterOTP,
  getAllAttendanceCloneforMapView,
  getStreetAndShopDetails,
  updateShopStatusdataapproved,
  updateShopStatusphoneapproved,
  updateShopStatuskycapproved,
  getshopDataById,
};
