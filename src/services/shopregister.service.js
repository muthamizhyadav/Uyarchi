const httpStatus = require('http-status');
const { Product } = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { Shop, AttendanceClone, AttendanceClonenew } = require('../models/b2b.ShopClone.model');
const sentOTP = require('../config/registershop.config');
const OTP = require('../models/saveOtp.model');
const bcrypt = require('bcryptjs');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');
const OrderPayment = require('../models/orderpayment.model');

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
const change_password = async (body, shopId) => {
  // console.log(shopId);
  const salt = await bcrypt.genSalt(10);
  let { password } = body;
  password = await bcrypt.hash(password, salt);
  let setpass = await Shop.findById({ _id: shopId });
  // console.log(setpass);
  if (!setpass) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not Found');
  }
  setpass = await Shop.findByIdAndUpdate({ _id: shopId }, { password: password }, { new: true });
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
  // if (odrers.length == 0) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Order Not Found');
  // }
  return odrers;
};

const get_mypayments = async (req) => {
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
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $project: {
              GSTamount: {
                $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100],
              },
              totalRupees: {
                $add: [
                  { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                  { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
                ],
              },
              CGSTAmount: {
                $divide: [
                  { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
                  2,
                ],
              },
              SGSTAmount: {
                $divide: [
                  { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
                  2,
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              GSTamount: { $sum: { $round: ['$GSTamount', 0] } },
              totalRupees: { $sum: { $round: ['$totalRupees', 0] } },
              CGSTAmount: { $sum: { $round: ['$CGSTAmount', 0] } },
              SGSTAmount: { $sum: { $round: ['$SGSTAmount', 0] } },
            },
          },
        ],
        as: 'productorderclonesdata',
      },
    },
    {
      $unwind: '$productorderclonesdata',
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: {
              _id: null,
              paidAmt: { $sum: '$paidAmt' },
            },
          },
        ],
        as: 'orderpayments',
      },
    },
    {
      $unwind: '$orderpayments',
    },
    {
      $addFields: {
        totalpaid: '$orderpayments.paidAmt',
      },
    },
    {
      $addFields: {
        totalRupees: { $round: ['$productorderclonesdata.totalRupees', 0] },
      },
    },
    {
      $addFields: {
        GSTamount: { $round: ['$productorderclonesdata.GSTamount', 0] },
      },
    },
    {
      $addFields: {
        CGSTAmount: { $round: ['$productorderclonesdata.CGSTAmount', 0] },
      },
    },
    {
      $addFields: {
        SGSTAmount: { $round: ['$productorderclonesdata.SGSTAmount', 0] },
      },
    },
    {
      $project: {
        product: '$productOrderdata',
        _id: 1,
        GSTamount: 1,
        CGSTAmount: 1,
        SGSTAmount: 1,
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
        // gsttotal: 1,
        // subtotal: 1,
        // SGST: 1,
        // CGST: 1,
        paidamount: 1,
        Uid: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        time: 1,
        created: 1,
        timeslot: 1,
        orderpayments: '$orderpayments',
        totalpaid: 1,
        totalRupees: 1,
        pendingAmount: { $subtract: ['$totalRupees', '$orderpayments.paidAmt'] },
        pendingAmountstatus: { $ne: ['$totalRupees', '$orderpayments.paidAmt'] },
        pay_type: 1,
        // productorderclonesdata: '$productorderclonesdata',
      },
    },
    {
      $match: { pendingAmountstatus: true },
    },
  ]);
  // if (odrers.length == 0) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Order Not Found');
  // }
  return odrers;
};

const getpayment_history = async (shopId, id) => {
  let orderHistory = await OrderPayment.aggregate([
    { $match: { orderId: id } },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'orderId',
        foreignField: '_id',
        pipeline: [
          {
            $match: { shopId: { $eq: shopId } },
          },
        ],
        as: 'shoporderclones',
      },
    },
    {
      $unwind: '$shoporderclones',
    },
    {
      $project: {
        _id: 1,
        payment: 1,
        active: 1,
        archive: 1,
        paidAmt: 1,
        date: 1,
        time: 1,
        created: 1,
        orderId: 1,
        type: 1,
        pay_type: 1,
        paymentMethod: 1,
        paymentstutes: 1,
        OrderId: '$shoporderclones.OrderId',
        customerBillId: '$shoporderclones.customerBillId',
        created: '$shoporderclones.created',
      },
    },
  ]);
  return orderHistory;
};
const get_pendung_amount = async (shopId, id) => {
  const odrers = await ShopOrderClone.aggregate([
    { $match: { shopId: shopId, _id: id } },
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
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $project: {
              GSTamount: {
                $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100],
              },
              totalRupees: {
                $add: [
                  { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                  { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
                ],
              },
              CGSTAmount: {
                $divide: [
                  { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
                  2,
                ],
              },
              SGSTAmount: {
                $divide: [
                  { $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$finalPricePerKg'] }, '$GST_Number'] }, 100] },
                  2,
                ],
              },
            },
          },
          {
            $group: {
              _id: null,
              GSTamount: { $sum: { $round: ['$GSTamount', 0] } },
              totalRupees: { $sum: { $round: ['$totalRupees', 0] } },
              CGSTAmount: { $sum: { $round: ['$CGSTAmount', 0] } },
              SGSTAmount: { $sum: { $round: ['$SGSTAmount', 0] } },
            },
          },
        ],
        as: 'productorderclonesdata',
      },
    },
    {
      $unwind: '$productorderclonesdata',
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: {
              _id: null,
              paidAmt: { $sum: '$paidAmt' },
            },
          },
        ],
        as: 'orderpayments',
      },
    },
    {
      $unwind: '$orderpayments',
    },
    {
      $addFields: {
        totalpaid: '$orderpayments.paidAmt',
      },
    },
    {
      $addFields: {
        totalRupees: { $round: ['$productorderclonesdata.totalRupees', 0] },
      },
    },
    {
      $addFields: {
        GSTamount: { $round: ['$productorderclonesdata.GSTamount', 0] },
      },
    },
    {
      $addFields: {
        CGSTAmount: { $round: ['$productorderclonesdata.CGSTAmount', 0] },
      },
    },
    {
      $addFields: {
        SGSTAmount: { $round: ['$productorderclonesdata.SGSTAmount', 0] },
      },
    },
    {
      $project: {
        product: '$productOrderdata',
        _id: 1,
        GSTamount: 1,
        CGSTAmount: 1,
        SGSTAmount: 1,
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
        // gsttotal: 1,
        // subtotal: 1,
        // SGST: 1,
        // CGST: 1,
        paidamount: 1,
        Uid: 1,
        OrderId: 1,
        customerBillId: 1,
        date: 1,
        time: 1,
        created: 1,
        timeslot: 1,
        orderpayments: '$orderpayments',
        totalpaid: 1,
        totalRupees: 1,
        pendingAmount: { $subtract: ['$totalRupees', '$orderpayments.paidAmt'] },
        pendingAmountstatus: { $ne: ['$totalRuees', '$orderpayments.paidAmt'] },
        pay_type: 1,
      },
    },
    // {
    //   $match: { pendingAmountstatus: true },
    // },
  ]);
  if (odrers.length == 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Order Not Found');
  }
  return odrers[0];
};

const get_orderamount = async (shopId, body) => {
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Shop Not Registered');
  }
  let created = moment();
  let date = moment().format('YYYY-MM-DD');
  let time = moment().format('hhmm');

  const order = await OrderPayment.create({
    orderId: body.orderId,
    payment: 'self',
    paidAmt: body.paidamount,
    paymentMethod: 'self',
    created: created,
    date: date,
    time: time,
  });
  return order;
};



const get_raiseonissue = async (shopId) => {
  let last24h = moment().subtract(24, 'h').toDate();
  const value = await ShopOrderClone.aggregate([
    {
      $sort: { created: -1 }
    },
    {
      $match: {
        shopId: { $eq: shopId },
        status: { $eq: "Delivered" },
        delivered_date: { $gte: last24h },
      }
    },
    {
      $project: {
        OrderId: 1,
        created: 1,
        delivery_type: 1,
        status: 1,
        date: 1,
        time: 1,
        time_of_delivery: 1,
        delivered_date: 1
      }
    }

  ])
  return value;
};



const get_raiseorder_issue = async (shopId, orderId) => {
  let last24h = moment().subtract(24, 'h').toDate();
  let shopOrder = await ShopOrderClone.aggregate([
    {
      $match: {
        shopId: { $eq: shopId },
        status: { $eq: "Delivered" },
        delivered_date: { $gte: last24h },
        _id: orderId
      }
    },
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
        status: 1,
        delivery_type: 1,
        Payment: 1,
        devevery_mode: 1,
        time_of_delivery: 1,
        pay_type: 1,
        paymentMethod: 1,
        OrderId: 1,
        date: 1,
        time: 1,
        created: 1,
        delivered_date: 1,
        reason: 1,
        product: "$productOrderdata"
      }
    }
  ])
  if (shopOrder.length == 0) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Order Not Found');
  }
  return shopOrder[0];
};



module.exports = {
  register_shop,
  verify_otp,
  set_password,
  login_now,
  get_myDetails,
  get_myorder,
  change_password,
  get_mypayments,
  getpayment_history,
  get_pendung_amount,
  get_orderamount,
  get_raiseonissue,
  get_raiseorder_issue
};
