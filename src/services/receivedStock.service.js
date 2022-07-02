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
      },
    },
  ]);
  return values;
};

module.exports = { getDataById };
