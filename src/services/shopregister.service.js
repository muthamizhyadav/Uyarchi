const httpStatus = require('http-status');
const { Product } = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Shop, AttendanceClone, AttendanceClonenew } = require('../models/b2b.ShopClone.model');
const sentOTP = require('../config/registershop.config');
const OTP = require('../models/saveOtp.model');
const bcrypt = require('bcryptjs');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');

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

const get_myorder = async (req) => {
  const odrers = await ShopOrderClone.aggregate([
    { $match: { shopId: req.shopId } },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $lookup: {
              from: 'products',
              localField: 'productid',
              foreignField: '_id',
              as: 'products',
            },
          },
          {
            $unwind: '$products',
          },
          {
            $project: {
              _id: 1,
              status: 1,
              orderId: 1,
              productid: 1,
              quantity: 1,
              priceperkg: 1,
              GST_Number: 1,
              HSN_Code: 1,
              packtypeId: 1,
              productpacktypeId: 1,
              packKg: 1,
              unit: 1,
              date: 1,
              time: 1,
              customerId: 1,
              finalQuantity: 1,
              finalPricePerKg: 1,
              created: 1,
              productTitle: '$products.productTitle',
            },
          },
        ],
        as: 'productOrderdata',
      },
    },
    {
      $project: {
        product: '$productOrderdata',
        _id: 1,
        status: 1,
        productStatus: 1,
        customerDeliveryStatus: 1,
        receiveStatus: 1,
        pettyCashReceiveStatus: 1,
        AssignedStatus: 1,
        completeStatus: 1,
        UnDeliveredStatus: 1,
        customerBilldate: 1,
        customerBilltime: 1,
        lapsedOrder: 1,
        delivery_type: 1,
        Payment: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        total: 1,
        gsttotal: 1,
        subtotal: 1,
        SGST: 1,
        CGST: 1,
        paidamount: 1,
        Uid: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        time: 1,
        created: 1,
        timeslot: 1,
      },
    },
  ]);
  if (odrers.length == 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Order Not Found');
  }
  return odrers;
};

module.exports = { register_shop, verify_otp, set_password, login_now, get_myDetails, get_myorder };
