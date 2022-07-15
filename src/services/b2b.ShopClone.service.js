const httpStatus = require('http-status');
const { Shop, AttendanceClone } = require('../models/b2b.ShopClone.model');
const { MarketShopsClone, MarketClone } = require('../models/market.model');
const { Users } = require('../models/B2Busers.model');
const ApiError = require('../utils/ApiError');
const Textlocal = require('../config/textLocal');
const Verfy = require('../config/OtpVerify');
// Shop Clone Serive

const createShopClone = async (shopBody) => {
  const shop = await Shop.create(shopBody);
  console.log(shop);
  return shop;
};

const filterShopwithNameAndContact = async (key) => {
  // const shop = await Shop.find({ $or: [{ SName: { $regex: key } }, { SCont1: { $regex: key } }] });
  // const marketClone = await MarketShopsClone.find({ $or: [{ SName: { $regex: key } }, { mobile: { $regex: key } },{ ownnum: { $regex: key } }] });
  const marketClone = await MarketShopsClone.aggregate([
    {
      $match: {
        $or: [{ SName: { $regex: key } }, { mobile: { $regex: key } }, { ownnum: { $regex: key } }],
      },
    },
  ]);
  const shop = await Shop.aggregate([
    {
      $match: {
        $or: [{ SName: { $regex: key } }, { mobile: { $regex: key } }],
      },
    },
  ]);
  const returns = marketClone.concat(shop);

  return returns;
};

const getAllShopClone = async () => {
  return Shop.find();
};

const getshopWardStreetNamesWithAggregation = async (page) => {
  let values = await Shop.aggregate([
    {
      $match: {
        $and: [{ type: { $eq: 'shop' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'Uid',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: 'UsersData',
      },
    },
    {
      $unwind: '$UsersData',
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'Wardid',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              ward: 1,
            },
          },
        ],
        as: 'WardData',
      },
    },
    {
      $unwind: '$WardData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'Strid',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              street: 1,
            },
          },
        ],
        as: 'StreetData',
      },
    },
    {
      $unwind: '$StreetData',
    },
    // shoplists
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        // pipeline:[
        //     {
        //       $project: {
        //         street:1
        //       }
        //     }
        // ],
        as: 'shoptype',
      },
    },
    {
      $unwind: '$shoptype',
    },
    {
      $project: {
        // _id:1,
        // created:1,
        street: '$StreetData.street',
        ward: '$WardData.ward',
        username: '$UsersData.name',
        shoptype: '$shoptype.shopList',
        photoCapture: 1,
        SName: 1,
        Slat: 1,
        Slong: 1,
        created: 1,
        SOwner: 1,

        mobile: 1,
        date: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.find().count();
  return {
    values: values,
    total: total,
  };
};

const getShopById = async (id) => {
  const shop = await Shop.findById(id);
  return shop;
};

const updateShopById = async (id, updateBody) => {
  let shop = await getShopById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not found');
  }
  shop = await Shop.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return shop;
};

// register user

const craeteRegister = async (shopBody) => {
  const { mobile } = shopBody;
  const register = await Users.findOne({ phoneNumber: mobile });
  // console.log(register);
  if (register) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MobileNumber already registered');
  } else if (register == null) {
    const shop = await Shop.find({ mobile: mobile });
    if (shop.length != 0) {
      return shop;
    } else {
      let b2bshop = await Shop.create(shopBody);
      return b2bshop;
    }
  }
};

const deleteShopById = async (id) => {
  let shop = await getShopById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUNDm, 'Shop Not Found');
  }
  (shop.active = false), (shop.archive = true);
  await shop.save();
  return shop;
};

// Attendance Clone Service

const createAttendanceClone = async (shopBody) => {
  const attendance = await AttendanceClone.create(shopBody);
  console.log(attendance);
  return attendance;
};

const getAllAttendanceClone = async (id, date, fromtime, totime, page) => {
  let match;
  let to;
  let from;
  if (parseInt(fromtime) <= parseInt(totime)) {
    to = parseInt(fromtime);
    from = parseInt(totime);
  } else {
    to = parseInt(totime);
    from = parseInt(fromtime);
  }
  console.log('les', from);
  console.log('ge', to);
  if (id != 'null' && date != 'null' && fromtime != 'null' && totime != 'null') {
    //  match=[{ Uid: { $eq: id }},{ date: { $eq: date }},{ time:{ $gte: from,$lte: to}},{active:{$eq:true}}];
    match = [
      { Uid: { $eq: id } },
      { date: { $eq: date } },
      { time: { $gte: to } },
      { time: { $lte: from } },
      { active: { $eq: true } },
    ];
  } else if (id != 'null' && date == 'null' && fromtime == 'null' && totime == 'null') {
    match = [{ Uid: { $eq: id } }, { active: { $eq: true } }];
  } else if (id == 'null' && date != 'null' && fromtime == 'null' && totime == 'null') {
    match = [{ date: { $eq: date } }, { active: { $eq: true } }];
    console.log('df');
  } else if (id == 'null' && (date == 'null') & (fromtime != 'null') && totime != 'null') {
    //  match=[{ time:{ $gte: from}},{ time:{$lte: to}},{active:{$eq:true}}]
    match = [{ time: { $gte: to } }, { time: { $lte: from } }, { active: { $eq: true } }];
  } else if (id == 'null' && date != 'null' && fromtime != 'null' && totime != 'null') {
    //  match=[{ date: { $eq: date }},{ time:{$lte: to ,$gte: from}},{active:{$eq:true}}]
    match = [{ date: { $eq: date } }, { time: { $gte: to } }, { time: { $lte: from } }, { active: { $eq: true } }];
  } else if (id != 'null' && date == 'null' && fromtime != 'null' && totime != 'null') {
    //  match=[{ Uid: { $eq: id }},{ time:{$lte: to, $gte: from}},{active:{$eq:true}}]
    match = [{ Uid: { $eq: id } }, { time: { $gte: to } }, { time: { $lte: from } }, { active: { $eq: true } }];
  } else if (id != 'null' && date != 'null' && fromtime == 'null' && totime == 'null') {
    match = [{ Uid: { $eq: id } }, { date: { $eq: date } }, { active: { $eq: true } }];
  } else {
    match = [{ Uid: { $ne: null } }, { active: { $eq: true } }];
  }
  const data = await AttendanceClone.aggregate([
    { $sort: { date: -1, time: -1 } },
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'Uid',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    { $unwind: '$b2busersData' },
    { $skip: 10 * page },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        photoCapture: 1,
        active: 1,
        true: 1,
        archive: 1,
        false: 1,
        Alat: 1,
        Along: 1,
        date: 1,
        time: 1,
        created: 1,
        userName: '$b2busersData.name',
        phoneNumber: '$b2busersData.phoneNumber',
      },
    },
  ]);
  const count = await AttendanceClone.aggregate([
    {
      $match: {
        $and: match,
      },
    },
  ]);

  return {
    data: data,
    count: count.length,
  };
};

const getAttendanceById = async (id) => {
  const attendance = await AttendanceClone.findById(id);
  return attendance;
};

const updateAttendanceById = async (id, updateBody) => {
  let attendance = await getAttendanceById(id);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not found');
  }
  attendance = await AttendanceClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return attendance;
};

const deleteAttendanceById = async (id) => {
  let attendance = await getAttendanceById(id);
  if (!attendance) {
    throw new ApiError(httpStatus.NOT_FOUNDm, 'attendance Not Found');
  }
  (attendance.active = false), (attendance.archive = true);
  await attendance.save();
  return attendance;
};

const totalCount = async (userId) => {
  const moment = require('moment');
  let datenow = moment(new Date()).format('DD-MM-YYYY');
  const Totalcount = await Shop.find({ Uid: userId, type: 'shop' }).count();
  const todayCount = await Shop.find({ date: datenow, Uid: userId, type: 'shop' }).count();
  const marketTotalcount = await MarketClone.find({ Uid: userId }).count();
  const markettodayCount = await MarketClone.find({ date: datenow, Uid: userId }).count();
  const marketshopTotalcount = await Shop.find({ Uid: userId, type: 'market' }).count();
  const marketshoptodayCount = await Shop.find({ date: datenow, Uid: userId, type: 'market' }).count();
  // console.log(Totalcount, todayCount, marketTotalcount, markettodayCount, marketshopTotalcount, marketshoptodayCount);
  return {
    shopTotal: Totalcount,
    shopToday: todayCount,
    marketTotal: marketTotalcount,
    marketToday: markettodayCount,
    marketShopTotal: marketshopTotalcount,
    marketShopToday: marketshoptodayCount,
  };
};

// get marketShop

const getMarkeShop = async (marketId) => {
  let values = await Shop.aggregate([
    {
      $match: {
        $and: [{ type: { $eq: 'market' } }, { marketId: { $eq: marketId } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'Uid',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: 'UsersData',
      },
    },
    {
      $unwind: '$UsersData',
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'Wardid',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              ward: 1,
            },
          },
        ],
        as: 'WardData',
      },
    },
    {
      $unwind: '$WardData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'Strid',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              street: 1,
            },
          },
        ],
        as: 'StreetData',
      },
    },
    {
      $unwind: '$StreetData',
    },
    // shoplists
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        // pipeline:[
        //     {
        //       $project: {
        //         street:1
        //       }
        //     }
        // ],
        as: 'shoptype',
      },
    },
    {
      $unwind: '$shoptype',
    },
    {
      $lookup: {
        from: 'marketclones',
        localField: 'marketId',
        foreignField: '_id',
        as: 'marketData',
      },
    },
    {
      $unwind: '$marketData',
    },
    {
      $project: {
        // _id:1,
        // created:1,
        street: '$StreetData.street',
        ward: '$WardData.ward',
        username: '$UsersData.name',
        shoptype: '$shoptype.shopList',
        marketName: '$marketData.MName',
        photoCapture: 1,
        SName: 1,
        Slat: 1,
        Slong: 1,
        created: 1,
        SOwner: 1,
        marketId: 1,
        type: 1,
        mobile: 1,
        date: 1,
      },
    },
  ]);

  return values;
};

const forgotPassword = async (body) => {
  // const { phoneNumber } = body;
  // await Textlocal.Otp(body);
  let users = await Users.findOne({ phoneNumber: body.mobileNumber });
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not Found');
  }
  return await Textlocal.Otp(body, users);
};
const otpVerfiy = async (body) => {
  // const { phoneNumber } = body;
  // await Textlocal.Otp(body);
  let users = await Users.findOne({ phoneNumber: body.mobileNumber });
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not Found');
  }

  return await Verfy.verfiy(body, users);
};

module.exports = {
  createShopClone,
  getAllShopClone,
  getShopById,
  updateShopById,
  deleteShopById,
  filterShopwithNameAndContact,
  // Attendace exports
  createAttendanceClone,
  getAllAttendanceClone,
  getAttendanceById,
  getshopWardStreetNamesWithAggregation,
  updateAttendanceById,
  deleteAttendanceById,
  totalCount,
  // get marketShop
  getMarkeShop,
  craeteRegister,
  forgotPassword,
  otpVerfiy,
};
