const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const b2bCloneService = require('../services/b2b.ShopClone.service');
const token = require('../services/token.service');
const { Shop } = require('../models/b2b.ShopClone.model');
const { AttendanceClone } = require('../models/b2b.ShopClone.model');

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

const getshopWardStreetNamesWithAggregation_withfilter = catchAsync(async (req, res) => {
  console.log(req.body);

  const shop = await b2bCloneService.getshopWardStreetNamesWithAggregation_withfilter(
    req.params.district,
    req.params.zone,
    req.params.ward,
    req.params.street,
    req.params.status,
    req.params.page
  );
  res.send(shop);
});

const getshopWardStreetNamesWithAggregation_withfilter_daily = catchAsync(async (req, res) => {
  console.log(req.body);
  ///:user/:startdata/:enddate/:starttime/:endtime/:page
  const shop = await b2bCloneService.getshopWardStreetNamesWithAggregation_withfilter_daily(
    req.params.user,
    req.params.startdata,
    req.params.enddate,
    req.params.starttime,
    req.params.endtime,
    req.params.status,
    req.params.page
  );
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
  // console.log(req.files);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      attendance.image = 'images/attandanceClone/' + files.filename;
    });
  }
  res.send(attendance);
  await attendance.save();
});
const creatAttendanceClone_new = catchAsync(async (req, res) => {
  const attendance = await b2bCloneService.createAttendanceClone_new(req.body);
  attendance.Uid = req.userId;
  // console.log(req.files);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      attendance.image = 'images/attandanceClone/' + files.filename;
    });
  }
  res.send(attendance);
  await attendance.save();
});

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
  const shops = await b2bCloneService.updateShopStatus(req.params.id, 'data_approved', req.body);
  res.send(shops);
});

const updateShopStatusphoneapproved = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.updateShopStatus(req.params.id, 'phone_approved', req.body);
  res.send(shops);
});

const updateShopStatuskycapproved = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.updateShopStatus(req.params.id, 'kyc_verified', req.body);
  res.send(shops);
});

const getshopDataById = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.getshopDataById(req.params.id);
  res.send(shops);
});

const getshopWardStreetNamesWithAggregation_withfilter_all = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.getshopWardStreetNamesWithAggregation_withfilter_all(
    req.params.district,
    req.params.zone,
    req.params.ward,
    req.params.street
  );
  res.send(shops);
});

const getshopWardStreetNamesWithAggregation_withfilter_daily_all = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.getshopWardStreetNamesWithAggregation_withfilter_daily_all(
    req.params.user,
    req.params.startdata,
    req.params.enddate,
    req.params.starttime,
    req.params.endtime
  );
  res.send(shops);
});

const perdeleteShopById = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.perdeleteShopById(req.params.id);
  res.send(shops);
});

const searchShops = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.searchShops(req.params.key);
  res.send(shops);
});

const getVendorShops = catchAsync(async (req, res) => {
  const shops = await b2bCloneService.getVendorShops(req.params.key);
  res.send(shops);
});

const getNotAssignSalesManData = catchAsync(async (req, res) => {
  const data = await b2bCloneService.getnotAssignSalesmanData(req.params.id, req.params.page, req.params.limit);
  res.send(data);
});

const GetShopsByShopType = catchAsync(async (req, res) => {
  const data = await b2bCloneService.GetShopsByShopType(req.params.id, req.params.page);
  res.send(data);
});

const GetShopsReviewsByShopType = catchAsync(async (req, res) => {
  const data = await b2bCloneService.GetShopsReviewsByShopType(req.params.id, req.params.page);
  res.send(data);
});

const getShopReviewByShopid = catchAsync(async (req, res) => {
  const data = await b2bCloneService.getShopReviewByShopid(req.params.id);
  res.send(data);
});

const data1 = catchAsync(async (req, res) => {
  const data = await b2bCloneService.data1();
  res.send(data);
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
  getshopWardStreetNamesWithAggregation_withfilter,
  getshopWardStreetNamesWithAggregation_withfilter_daily,
  getshopWardStreetNamesWithAggregation_withfilter_all,
  getshopWardStreetNamesWithAggregation_withfilter_daily_all,
  perdeleteShopById,
  creatAttendanceClone_new,
  searchShops,
  getVendorShops,
  getNotAssignSalesManData,
  GetShopsByShopType,
  GetShopsReviewsByShopType,
  getShopReviewByShopid,
  data1,
};
