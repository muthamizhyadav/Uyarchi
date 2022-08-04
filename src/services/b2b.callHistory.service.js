const httpStatus = require('http-status');
const callHistoryModel = require('../models/b2b.callHistory.model');
const ApiError = require('../utils/ApiError');
const { Shop } = require('../models/b2b.ShopClone.model');
const { Users } = require('../models/B2Busers.model');
const moment = require('moment');

const createCallHistory = async (body) => {
  await Shop.findByIdAndUpdate({ _id: body.shopId }, { CallStatus: body.callStatus }, { new: true });
  let callHistory = await callHistoryModel.create(body);
  return callHistory;
};

const createcallHistoryWithType = async (body, userId) => {
  let time = moment().format('HHmmss');
  let date = moment().format('yyy-MM-DD');
  let servertime = moment().format('hh:mm a');
  let serverdate = moment().format('DD-MM-yyy');
  const { callStatus, shopId } = body;
  let sort;
  if (callStatus == 'reschedule') {
    sort = 2;
  }
  if (callStatus == 'callback') {
    sort = 3;
  }
  // if (callStatus == 'under_the_call') {
  //   sort = 4;
  // }
  if (callStatus == 'declined') {
    sort = 5;
  }
  if (callStatus == 'accept') {
    sort = 6;
  }
  let values = { ...body, ...{ userId: userId, date: serverdate, time: servertime } };
  let shopdata = await Shop.findOne({ _id: shopId });
  console.log(sort);
  if (callStatus != 'accept') {
    if (shopdata.callingStatus != 'accept') {
      await Shop.findByIdAndUpdate(
        { _id: shopId },
        { callingStatus: callStatus, sortdate: date, sorttime: time, callingStatusSort: sort },
        { new: true }
      );
    }
  }
  let callHistory = await callHistoryModel.create(values);
  return callHistory;
};

const getAll = async () => {
  return callHistoryModel.find();
};

const callingStatusreport = async () => {
  let acceptCount = await Shop.find({ callingStatus: 'accept' }).count();
  let callbackCount = await Shop.find({ callingStatus: 'callback' }).count();
  let rescheduleCount = await Shop.find({ callingStatus: 'reschedule' }).count();
  let pendingCount = await Shop.find({ callingStatus: 'Pending' }).count();
  let declinedCount = await Shop.find({ callingStatus: 'declined' }).count();
  return {
    acceptCount: acceptCount,
    callbackCount: callbackCount,
    rescheduleCount: rescheduleCount,
    pendingCount: pendingCount,
    declinedCount: declinedCount,
  };
};

const getById = async (id) => {
  console.log('params Id', id);
  let historys = await Shop.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'callhistories', //add table
        localField: '_id', //callhistory
        foreignField: 'shopId', //shopclone
        as: 'callhistory',
      },
    },
    {
      $lookup: {
        from: 'b2busers', //add table
        localField: 'callingUserId', //callhistory
        foreignField: '_id', //shopclone
        as: 'usersData',
      },
    },
    {
      $unwind: '$usersData',
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shopType',
      },
    },
    {
      $unwind: '$shopType',
    },
    {
      $project: {
        SName: 1,
        SOwner: 1,
        mobile: 1,
        Slat: 1,
        address: 1,
        userName: '$usersData.name',
        Slong: 1,
        date: 1,
        time: 1,
        shopName: '$shopType.shopList',
        callhistory: '$callhistory',
      },
    },
  ]);
  return historys;
};

const getShop = async (date, page, userId) => {
  let values = await Shop.aggregate([
    { $sort: { callingStatusSort: 1, sortdate: -1, sorttime: -1 } },

    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              $and: [{ date: { $eq: date } }],
            },
          },
        ],
        as: 'shopData',
      },
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'SType',
        foreignField: '_id',
        as: 'shoplists',
      },
    },
    {
      $unwind: '$shoplists',
    },
    {
      $project: {
        _id: 1,
        photoCapture: 1,
        callingStatus: 1,
        callingStatusSort: 1,
        active: 1,
        archive: 1,
        Wardid: 1,
        type: 1,
        SName: 1,
        SType: 1,
        SOwner: 1,
        mobile: 1,
        Slat: 1,
        Strid: 1,
        sortdatetime: 1,
        Slong: 1,
        address: 1,
        date: 1,
        time: 1,
        created: 1,
        status: 1,
        __v: 1,
        Uid: 1,
        shopData: '$shopData',
        shoptypeName: '$shoplists.shopList',
        matching: { $eq: ['$callingUserId', userId] },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await Shop.aggregate([
    { $sort: { callingStatusSort: 1, sortdatetime: 1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $match: {
              $and: [{ date: { $eq: date } }],
            },
          },
        ],
        as: 'shopData',
      },
    },
  ]);
  return { values: values, total: total.length };
};

const updateCallingStatus = async (id, updatebody) => {
  let shops = await Shop.findById(id);
  if (!shops) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shop not found');
  }
  shops = await Shop.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return shops;
};

const updateStatuscall = async (id, userId, updateBody) => {
  let status = await Shop.findById(id);
  if (!status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  status = await Shop.findByIdAndUpdate({ _id: id }, { callingStatus: 'On Call', callingUserId: userId }, { new: true });
  return status;
};

const updateOrderStatus = async (id) => {
  let orderedStatus = await callHistoryModel.findById(id);
  if (!orderedStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'OrderStatus not found');
  }
  orderedStatus = await callHistoryModel.findByIdAndUpdate({ _id: id }, { status: 'ordered' }, { new: true });
};

const createShopByOwner = async (body) => {
  let values = await Shop.create(body);
  return values;
};

const getOncallfromshops = async (userId) => {
  let values = await Shop.find({ Uid: userId, callingStatus: 'On Call' });
  console.log(values);
  if (values.length != 0) {
    return { OnCallstatus: false };
  } else {
    return { OnCallstatus: true };
  }
};

module.exports = {
  createCallHistory,
  getAll,
  getShop,
  updateCallingStatus,
  getById,
  updateStatuscall,
  createShopByOwner,
  createcallHistoryWithType,
  callingStatusreport,
  updateOrderStatus,
  getOncallfromshops,
};
