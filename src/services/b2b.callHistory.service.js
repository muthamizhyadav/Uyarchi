const httpStatus = require('http-status');
const callHistoryModel = require('../models/b2b.callHistory.model');
const ApiError = require('../utils/ApiError');
const { Shop } = require('../models/b2b.ShopClone.model');

const createCallHistory = async (body) => {
  console.log(body.callStatus);
  await Shop.findByIdAndUpdate({ _id: body.shopId }, { CallStatus: body.callStatus }, { new: true });
  let callHistory = await callHistoryModel.create(body);
  return callHistory;
};

const createcallHistoryWithType = async (body) => {
  const { callStatus, shopId } = body;
  let sort;
  if (callStatus == 'reschedule') {
    sort = 2;
  }
  if (callStatus == 'Call back') {
    sort = 3;
  }
  if (callStatus == 'under_the_call') {
    sort = 4;
  }
  if (callStatus != 'accept') {
    await Shop.findByIdAndUpdate({ _id: shopId }, { callingStatus: callStatus, callingStatusSort: sort }, { new: true });
  }
  let callHistory = await callHistoryModel.create(body);
  return callHistory;
};

const getAll = async () => {
  return callHistoryModel.find();
};

const callingStatusreport = async () => {
  let acceptCount = await Shop.find({ callingStatus: 'accept' }).count();
  let callbackCount = await Shop.find({ callingStatus: 'Call back' }).count();
  let rescheduleCount = await Shop.find({ callingStatus: 'reschedule' }).count();
  let pendingCount = await Shop.find({ callingStatus: 'pending' }).count();
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
  // let history = await callHistoryModel.find({shopId:id})
  // return history;
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
        as: 'shopName',
      },
    },
    // {
    //   $unwind: '$shopName',
    // },
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
        Slong: 1,
        date: 1,
        time: 1,
        shopName: '$shopType.shopList',
        shopHistory: '$shopName',
      },
    },
  ]);
  return historys;
};

const getShop = async (page) => {
  let values = await Shop.aggregate([
    { $sort: { callingStatusSort: 1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        as: 'shopData',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await Shop.aggregate([
    { $sort: { callingStatusSort: 1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
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
  status = await Shop.findByIdAndUpdate(
    { _id: id },
    { callingStatus: 'under_the_call', callingUserId: userId },
    { new: true }
  );
  return status;
};

const createShopByOwner = async (body) => {
  let values = await Shop.create(body);
  return values;
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
};
