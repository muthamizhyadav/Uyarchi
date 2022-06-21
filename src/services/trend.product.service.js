const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const TrendProduct = require('../models/trendproduct.model');

const getStreetsByWardIdAndProducts = async (date, page) => {
  let values = await TrendProduct.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'ProductData',
      },
    },
    {
      $unwind: '$ProductData'
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'steetId',
        foreignField: '_id',
        as: 'streetData',
      },
    },
    {
      $unwind: '$streetData',
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'streetData.wardId',
        foreignField: '_id',
        as: 'wardDataData',
      },
    },
    {
      $unwind: '$wardDataData',
    },
    // product details Lookup

    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productData',
      },
    },
    {
      $unwind: '$productData',
    },

    {
      $project: {
        WardData: '$wardDataData',
        streetData: '$streetData',
        productData: '$productData',
        
        Rate: 1,
      },
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let cal = await TrendProduct.aggregate([
    {
      $group: {
        _id: null,
        AvgRate: { $avg: '$Rate' },
        MaxRate: { $max: '$Rate' },
        minRate: { $min: '$Rate' },
      },
    },
  ]);
  let total = await TrendProduct.find().count();
  return { total: total, values: values, cal: cal };
};

module.exports = {
  getStreetsByWardIdAndProducts,
};
