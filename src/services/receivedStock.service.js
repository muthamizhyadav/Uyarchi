const httpStatus = require('http-status');
const { ReceivedOrders } = require('../models');
const ApiError = require('../utils/ApiError');
const ReceivedProduct = require('../models/receivedProduct.model');
const ReceivedStock = require('../models/receivedStock.model');

const getDataById = async (id) => {
  let values = await ReceivedStock.aggregate([
    {
      $match: {
        $and: [{ groupId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productsData',
      },
    },
    {
      $unwind: '$productsData',
    },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        status: 1,
        productName: '$productsData.productTitle',
        incomingWastage: 1,
        incomingQuantity: 1,
      },
    },
  ]);
  return values;
};

const getDataByLoading = async (id) => {
  let values = await ReceivedStock.aggregate([
    {
      $match: {
        $and: [{ groupId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productsData',
      },
    },
    {
      $unwind: '$productsData',
    },
    {
      $lookup: {
        from: 'callstatuses',
        localField: 'callstatusId',
        foreignField: '_id',
        as: 'callstatusData',
      },
    },
    {
      $unwind: '$callstatusData',
    },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        status: 1,
        productName: '$productsData.productTitle',
        incomingWastage: 1,
        incomingQuantity: 1,
        confirmOrder: '$callstatusData.confirmOrder',
        confirmprice: '$callstatusData.confirmprice',
      },
    },
  ]);
  return values;
};

const updateReceivedStockById = async (id, updateBody) => {
  let receivedStock = await ReceivedStock.findById(id);
  if (!receivedStock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  receivedStock = await ReceivedStock.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return receivedStock;
};

module.exports = { getDataById, updateReceivedStockById, getDataByLoading };
