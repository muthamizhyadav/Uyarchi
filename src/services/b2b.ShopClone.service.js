const httpStatus = require('http-status');
const { Shop, AttendanceClone, AttendanceClonenew } = require('../models/b2b.ShopClone.model');
const { MarketShopsClone, MarketClone } = require('../models/market.model');
const { Users } = require('../models/B2Busers.model');
const ApiError = require('../utils/ApiError');
const Textlocal = require('../config/textLocal');
const Verfy = require('../config/OtpVerify');
const RegisterOtp = require('../config/registerOtp');
const moment = require('moment');
const { verfiy } = require('../config/registerOTP.Verify');

// Shop Clone Serive

const createShopClone = async (shopBody) => {
  let servertime = moment().format('HHmm');
  let serverdate = moment().format('DD-MM-yyy');
  let filterDate = moment().format('yyy-MM-DD');
  let values = { ...shopBody, ...{ date: serverdate, time: servertime, filterDate: filterDate, status: 'Pending' } };
  const shop = await Shop.create(values);
  return shop;
};

const getStreetAndShopDetails = async (supplierId) => {
  let values = await Shop.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: supplierId } }],
      },
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'Strid',
        foreignField: '_id',
        as: 'streetData',
      },
    },
    {
      $unwind: '$streetData',
    },
    {
      $project: {
        SName: 1,
        mobile: 1,
        date: 1,
        time: 1,
        Uid: 1,
        streetName: '$streetData.street',
      },
    },
  ]);
  return values;
};

const filterShopwithNameAndContact = async (key) => {
  const marketClone = await MarketShopsClone.aggregate([
    {
      $match: {
        $or: [
          { SName: { $regex: key, $options: 'i' } },
          { mobile: { $regex: key, $options: 'i' } },
          { ownnum: { $regex: key, $options: 'i' } },
        ],
      },
    },
  ]);
  const shop = await Shop.aggregate([
    {
      $match: {
        $or: [{ SName: { $regex: key, $options: 'i' } }, { mobile: { $regex: key, $options: 'i' } }],
      },
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'Strid',
        foreignField: '_id',
        as: 'streetData',
      },
    },
    {
      $unwind: '$streetData',
    },
    {
      $limit: 50,
    },
    {
      $project: {
        SName: 1,
        mobile: 1,
        streetName: '$streetData.street',
        _id: 1,
        SOwner: 1,
        SType: 1,
        Slat: 1,
        Slong: 1,
        Strid: 1,
        Uid: 1,
        Wardid: 1,
        callingUserId: 1,
        created: 1,
        date: 1,
        marketId: 1,
        mobile: 1,
        photoCapture: 1,
        status: 1,
        time: 1,
        type: 1,
        streetId: '$streetData._id',
      },
    },
  ]);
  const returns = marketClone.concat(shop);

  return returns;
};

const getAllShopClone = async () => {
  return Shop.find();
};

const searchShops = async (key) => {
  let values = await Shop.aggregate([
    {
      $match: {
        $or: [{ SName: { $regex: key, $options: 'i' } }],
      },
    },
    {
      $limit: 90,
    },
  ]);
  return values;
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
            $lookup: {
              from: 'zones',
              localField: 'zoneId',
              foreignField: '_id',

              as: 'zonedata',
            },
          },
          {
            $unwind: '$zonedata',
          },
          {
            $project: {
              ward: 1,
              zone: '$zonedata.zone',
              zoneCode: '$zoneData.zoneCode',
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
              area: 1,
              locality: 1,
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
        Area: '$StreetData.area',
        Locality: '$StreetData.locality',
        photoCapture: 1,
        SName: 1,
        address: 1,
        Slat: 1,
        Slong: 1,
        status: 1,
        created: 1,
        SOwner: 1,
        kyc_status: 1,
        Uid: 1,
        zone: '$WardData.zone',
        zoneCode: '$WardData.zoneCode',
        active: 1,
        mobile: 1,
        date: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.find({ type: 'shop' }).count();

  return {
    values: values,
    total: total,
  };
};

const getshopWardStreetNamesWithAggregation_withfilter_all = async (district, zone, ward, street) => {
  let districtMatch = { active: true };
  let zoneMatch = { active: true };
  let wardMatch = { active: true };
  let streetMatch = { active: true };
  if (district != 'null') {
    districtMatch = { ...districtMatch, ...{ district: district } };
  }
  if (zone != 'null') {
    districtMatch = { ...districtMatch, ...{ zoneId: zone } };
  }
  if (ward != 'null') {
    wardMatch = { Wardid: { $eq: ward } };
  }
  if (street != 'null') {
    streetMatch = { Strid: { $eq: street } };
  }
  console.log(districtMatch);

  let values = await Shop.aggregate([
    {
      $match: {
        $and: [wardMatch, streetMatch],
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
            $match: districtMatch,
          },
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
              area: 1,
              locality: 1,
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
        Area: '$StreetData.area',
        Locality: '$StreetData.locality',
        ward: '$WardData.ward',
        username: '$UsersData.name',
        shoptype: '$shoptype.shopList',
        photoCapture: 1,
        SName: 1,
        address: 1,
        Slat: 1,
        Slong: 1,
        status: 1,
        created: 1,
        SOwner: 1,
        kyc_status: 1,
        active: 1,
        mobile: 1,
        date: 1,
      },
    },
  ]);
  return values;
};

const getshopWardStreetNamesWithAggregation_withfilter = async (district, zone, ward, street, status, page) => {
  // await Shop.updateMany({ active: true }, { $set: { status: 'Pending' } });
  let districtMatch = { active: true };
  let zoneMatch = { active: true };
  let wardMatch = { active: true };
  let streetMatch = { active: true };
  let statusMatch = { active: true };
  if (status != 'null') {
    streetMatch = { status: status };
  }
  if (district != 'null') {
    districtMatch = { ...districtMatch, ...{ district: district } };
  }
  if (zone != 'null') {
    districtMatch = { ...districtMatch, ...{ zoneId: zone } };
  }
  if (ward != 'null') {
    wardMatch = { Wardid: { $eq: ward } };
  }
  if (street != 'null') {
    streetMatch = { Strid: { $eq: street } };
  }
  console.log(districtMatch);

  let values = await Shop.aggregate([
    {
      $match: {
        $and: [{ type: { $eq: 'shop' } }, wardMatch, streetMatch, statusMatch],
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
            $match: districtMatch,
          },
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
              area: 1,
              locality: 1,
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
        Area: '$StreetData.area',
        Locality: '$StreetData.locality',
        ward: '$WardData.ward',
        username: '$UsersData.name',
        shoptype: '$shoptype.shopList',
        photoCapture: 1,
        SName: 1,
        address: 1,
        Slat: 1,
        Slong: 1,
        status: 1,
        created: 1,
        SOwner: 1,
        kyc_status: 1,
        active: 1,
        mobile: 1,
        date: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.aggregate([
    {
      $match: {
        $and: [{ type: { $eq: 'shop' } }, wardMatch, streetMatch, statusMatch],
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
            $match: districtMatch,
          },
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
        as: 'shoptype',
      },
    },
    {
      $unwind: '$shoptype',
    },
  ]);
  return {
    values: values,
    total: total.length,
  };
};

const getshopWardStreetNamesWithAggregation_withfilter_daily_all = async (user, startdata, enddate, starttime, endtime) => {
  ///:user/:startdata/:enddate/:starttime/:endtime/:page
  let userMatch = { active: true };
  let dateMatch = { active: true };
  let timeMatch = { active: true };
  let streetMatch = { active: true };
  let startTime = 0;
  let endTime = 2400;
  if (user != 'null') {
    userMatch = { Uid: user };
  }
  if (startdata != 'null' && enddate != 'null') {
    dateMatch = { filterDate: { $gte: startdata, $lte: enddate } };
  }
  if (starttime != 'null') {
    startTime = parseInt(starttime);
  }
  if (endtime != 'null') {
    endTime = parseInt(endtime);
  }
  timeMatch = { time: { $gte: startTime, $lte: endTime } };

  let values = await Shop.aggregate([
    {
      $sort: { filterDate: -1 },
    },
    {
      $match: {
        $and: [userMatch, dateMatch, timeMatch],
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
              area: 1,
              locality: 1,
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
        Area: '$StreetData.area',
        Locality: '$StreetData.locality',
        ward: '$WardData.ward',
        username: '$UsersData.name',
        shoptype: '$shoptype.shopList',
        photoCapture: 1,
        SName: 1,
        address: 1,
        Slat: 1,
        Slong: 1,
        status: 1,
        created: 1,
        SOwner: 1,
        kyc_status: 1,
        active: 1,
        mobile: 1,
        date: 1,
      },
    },
  ]);
  return values;
};

const getshopWardStreetNamesWithAggregation_withfilter_daily = async (
  user,
  startdata,
  enddate,
  starttime,
  endtime,
  status,
  page
) => {
  ///:user/:startdata/:enddate/:starttime/:endtime/:page
  let userMatch = { active: true };
  let dateMatch = { active: true };
  let timeMatch = { active: true };
  let streetMatch = { active: true };
  let startTime = 0;
  let endTime = 2400;
  let statusMatch = { active: true };
  if (status != 'null') {
    streetMatch = { status: status };
  }
  if (user != 'null') {
    userMatch = { Uid: user };
  }
  if (startdata != 'null' && enddate != 'null') {
    dateMatch = { filterDate: { $gte: startdata, $lte: enddate } };
  }
  if (starttime != 'null') {
    startTime = parseInt(starttime);
  }
  if (endtime != 'null') {
    endTime = parseInt(endtime);
  }
  timeMatch = { time: { $gte: startTime, $lte: endTime } };

  let values = await Shop.aggregate([
    {
      $sort: { filterDate: -1 },
    },
    {
      $match: {
        $and: [{ type: { $eq: 'shop' } }, userMatch, dateMatch, timeMatch, streetMatch],
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
              area: 1,
              locality: 1,
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
        Area: '$StreetData.area',
        Locality: '$StreetData.locality',
        ward: '$WardData.ward',
        username: '$UsersData.name',
        shoptype: '$shoptype.shopList',
        photoCapture: 1,
        SName: 1,
        address: 1,
        Slat: 1,
        Slong: 1,
        status: 1,
        created: 1,
        SOwner: 1,
        kyc_status: 1,
        active: 1,
        mobile: 1,
        date: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Shop.aggregate([
    {
      $sort: { filterDate: -1 },
    },
    {
      $match: {
        $and: [{ type: { $eq: 'shop' } }, userMatch, dateMatch, timeMatch, streetMatch],
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
        as: 'shoptype',
      },
    },
    {
      $unwind: '$shoptype',
    },
  ]);
  return {
    values: values,
    total: total.length,
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

const updateShopStatus = async (id, status, bodyData) => {
  let shop = await getShopById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shop Not Found');
  }
  shop = await Shop.findByIdAndUpdate({ _id: id }, { ...bodyData, ...{ status: status } }, { new: true });
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
      // let b2bshop = await Shop.create(shopBody);
      await RegisterOtp.Otp(mobile);
      return 'OTP send successfully';
    }
  }
};

const verifyRegisterOTP = async (body) => {
  const { otp, mobileNumber } = body;
  return await verfiy(otp, mobileNumber);
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
  let servertime = moment().format('HHmm');
  let servercreatetime = moment().format('hh:mm a');
  let serverdate = moment().format('DD-MM-yyy');
  let values = { ...shopBody, ...{ date: serverdate, time: servertime, created: servercreatetime } };
  const attendance = await AttendanceClone.create(values);
  return attendance;
};

const createAttendanceClone_new = async (shopBody) => {
  let servertime = moment().format('HHmm');
  let servercreatetime = moment().format('hh:mm a');
  let serverdate = moment().format('DD-MM-yyy');
  let values = { ...shopBody, ...{ date: serverdate, time: servertime, created: servercreatetime } };
  const attendance = await AttendanceClonenew.create(values);
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
  if (id != 'null' && date != 'null' && fromtime != 'null' && totime != 'null') {
    //  match=[{ Uid: { $eq: id }},{ date: { $eq: date }},{ time:{ $gte: from,$lte: to}},{active:{$eq:true}}];
    const d = new Date(date);
    date = moment(d).format('DD-MM-YYYY');
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
    const d = new Date(date);
    date = moment(d).format('DD-MM-YYYY');
    //  match=[{ date: { $eq: date }},{ time:{$lte: to ,$gte: from}},{active:{$eq:true}}]
    match = [{ date: { $eq: date } }, { time: { $gte: to } }, { time: { $lte: from } }, { active: { $eq: true } }];
  } else if (id != 'null' && date == 'null' && fromtime != 'null' && totime != 'null') {
    //  match=[{ Uid: { $eq: id }},{ time:{$lte: to, $gte: from}},{active:{$eq:true}}]
    match = [{ Uid: { $eq: id } }, { time: { $gte: to } }, { time: { $lte: from } }, { active: { $eq: true } }];
  } else if (id != 'null' && date != 'null' && fromtime == 'null' && totime == 'null') {
    const d = new Date(date);
    date = moment(d).format('DD-MM-YYYY');
    match = [{ Uid: { $eq: id } }, { date: { $eq: date } }, { active: { $eq: true } }];
  } else {
    match = [{ Uid: { $ne: null } }, { active: { $eq: true } }];
  }
  const data = await AttendanceClonenew.aggregate([
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
        image: 1,
        userName: '$b2busersData.name',
        phoneNumber: '$b2busersData.phoneNumber',
      },
    },
  ]);
  const count = await AttendanceClonenew.aggregate([
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
  ]);

  return {
    data: data,
    count: count.length,
  };
};

const getAllAttendanceCloneforMapView = async (id, date, fromtime, totime) => {
  let match;
  let to;
  let from;
  const d = new Date(date);
  date = moment(d).format('DD-MM-YYYY');
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
  const data = await AttendanceClonenew.aggregate([
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
    {
      $project: {
        Alat: 1,
        Along: 1,
        created: 1,
        date: 1,
      },
    },
  ]);
  return data;
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
  const Secondtotal = await Shop.find({ Uid: userId, type: 'second' }).count();
  const todayCount = await Shop.find({ date: datenow, Uid: userId, type: 'shop' }).count();
  const secontodayCount = await Shop.find({ date: datenow, Uid: userId, type: 'second' }).count();

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
    Secondtotal: Secondtotal,
    secontodayCount: secontodayCount,
  };
};

// get marketShop

const getMarkeShop = async (marketId, page) => {
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
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
    {
      $project: {
        _id: 1,
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
        shopNo: 1,
        marketId: 1,
        status: 1,
        kyc_status: 1,
        Uid: 1,
        Area: '$StreetData.area',
        Locality: '$StreetData.locality',
        type: 1,
        mobile: 1,
        active: 1,
        date: 1,
      },
    },
  ]);
  let total = await Shop.aggregate([
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
  ]);
  return { values: values, total: total.length };
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

const getshopDataById = async (id) => {
  const shop = await Shop.findById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
  }
  if (shop.status == 'phone_approved' || shop.status == 'kyc_verified') {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Data Not Acceptable');
  } else {
    return shop;
  }
};

const perdeleteShopById = async (id) => {
  let shop = await getShopById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not Found');
  }
  shop = await Shop.findByIdAndDelete(id);
  return {
    message: 'Deleted',
  };
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
  getStreetAndShopDetails,
  forgotPassword,
  otpVerfiy,
  verifyRegisterOTP,
  updateShopStatus,
  getAllAttendanceCloneforMapView,
  getshopDataById,
  getshopWardStreetNamesWithAggregation_withfilter,
  getshopWardStreetNamesWithAggregation_withfilter_daily,
  getshopWardStreetNamesWithAggregation_withfilter_all,
  getshopWardStreetNamesWithAggregation_withfilter_daily_all,
  perdeleteShopById,
  createAttendanceClone_new,
  searchShops,
};
