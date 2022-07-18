const httpStatus = require('http-status');
const callHistoryModel = require('../models/b2b.callHistory.model');
const ApiError = require('../utils/ApiError');
const { Shop } = require('../models/b2b.ShopClone.model');
// const moment = require('moment');

const createCallHistory = async (body) => {
  console.log(body.callStatus);
  await Shop.findByIdAndUpdate({ _id: body.shopId }, { CallStatus: body.callStatus }, { new: true });
  let callHistory = await callHistoryModel.create(body);
  return callHistory;
};

const getAll = async () => {
  return callHistoryModel.find();
};

const getById = async (id) => {
  // let history = await callHistoryModel.find({shopId:id})
  // return history;
  let historys = await callHistoryModel.aggregate([
    {
      $match: {
        $and: [{ shopId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones', //add table
        localField: 'shopId', //callhistory
        foreignField: '_id', //shopclone
        as: 'shopName',
      },
    },
    {
      $unwind: '$shopName',
    },
    {
      $lookup: {
        from: 'shoplists',
        localField: 'shopName.SType',
        foreignField: '_id',
        as: 'shopType',
      },
    },
    {
      $unwind: '$shopType',
    },
    {
      $project: {
        shopName: '$shopName.SName',
        shopMobile: '$shopName.mobile',
        shopType: '$shopType.shopList',
        _id: 1,
      },
    },
  ]);
  return historys;
};

const getShop = async (page) => {
  let values = await Shop.aggregate([
    { $sort: { callStatus: -1, time: -1 } },
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',

        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { callStatus: -1 },
          },
        ],
        as: 'shopData',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await Shop.aggregate([
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        pipeline: [
          {
            $sort: { callStatus: -1 },
          },
        ],
        as: 'shopData',
      },
    },
    {
      $unwind: '$shopData',
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
  status = await Shop.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  status = await Shop.findByIdAndUpdate({ _id: id }, { callingUserId: userId }, { new: true });
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
};
