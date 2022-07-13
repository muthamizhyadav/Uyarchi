const httpStatus = require('http-status');
const callHistoryModel = require('../models/b2b.callHistory.model');
const ApiError = require('../utils/ApiError');
const { Shop } = require('../models/b2b.ShopClone.model');
// const moment = require('moment');

const createCallHistory = async (body) => {
  let callHistory = await callHistoryModel.create(body);
  return callHistory;
};

const getAll = async () => {
  return callHistoryModel.find();
};

const getShop = async (page) => {
  // return shopclone.find()
  let values = await Shop.aggregate([
    {
      $lookup: {
        from: 'callhistories',
        localField: '_id',
        foreignField: 'shopId',
        as: 'shopData',
      },
    },
    {
      $sort: { callStatus: -1 },
    },
    //   {
    //     $unwind: '$shopData',
    //   },
  ]);
  return values;
};

module.exports = {
  createCallHistory,
  getAll,
  getShop,
};
