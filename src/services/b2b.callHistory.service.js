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
  // let callCount = await callHistoryModel.findById(id)
  // return callCount;
  let history = await callHistoryModel.find({shopId:id})
  return history;
}

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

const updateCallingStatus = async (id, userId) => {
  await Shop.findByIdAndUpdate({ _id: id }, { callingStatus: 'On_a_call', callingUserId: userId }, { new: true });
  return 'On a Call';
};

module.exports = {
  createCallHistory,
  getAll,
  getShop,
  updateCallingStatus,
  getById,
};
  

