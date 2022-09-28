const httpStatus = require('http-status');
const { Product } = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Shop, AttendanceClone, AttendanceClonenew } = require('../models/b2b.ShopClone.model');
const sentOTP = require('../config/registershop.config');
const OTP = require('../models/saveOtp.model');
const bcrypt = require('bcryptjs');

const register_shop = async (body) => {
  const mobileNumber = body.mobile;
  let shop = await Shop.findOne({ mobile: mobileNumber });
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop-Not-found');
  }
  shop = await Shop.findOne({ mobile: mobileNumber, registered: { $ne: true } });
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop-Already-registered');
  }
  const otp = await sentOTP(mobileNumber, shop);
  console.log(otp);
  return { message: 'Otp Send Successfull' };
};

const verify_otp = async (body) => {
  const mobileNumber = body.mobile;
  const otp = body.otp;
  let findOTP = await OTP.findOne({
    mobileNumber: mobileNumber,
    OTP: otp,
    create: { $gte: moment(new Date().getTime() - 15 * 60 * 1000) },
  });
  if (!findOTP) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  }
  let shop = await Shop.findById({ _id: findOTP.userId });
  return shop;
};
const set_password = async (body) => {
  const salt = await bcrypt.genSalt(10);
  let { password, shopId } = body;
  password = await bcrypt.hash(password, salt);
  let setpass = await Shop.findById({ _id: shopId });
  if (!setpass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not Found');
  }
  setpass = await Shop.findByIdAndUpdate({ _id: shopId }, { password: password, registered: true }, { new: true });
  return setpass;
};

const login_now = async (body) => {
  const { mobile, password } = body;
  let userName = await Shop.findOne({ mobile: mobile });
  if (!userName) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Shop Not Found');
  }
  userName = await Shop.findOne({ mobile: mobile, registered: true });
  if (!userName) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Shop Not Registered');
  }
  if (!(await userName.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password Doesn't Match");
  }

  return userName;
};
const get_myDetails = async (req) => {
  const shop = await Shop.aggregate([{ $match: { _id: req.shopId } }]);
  if (shop.length == 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Shop Not Registered');
  }
  return shop[0];
};

module.exports = { register_shop, verify_otp, set_password, login_now, get_myDetails };
