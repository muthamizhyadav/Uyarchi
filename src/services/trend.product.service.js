const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const TrendProduct = require('../models/trendproduct.model');
const { Product } = require('../models/product.model');

const getStreetsByWardIdAndProducts = async (wardId, street, date, page) => {
  console.log(date, 'sdfsa');

  let match;
  if (street != 'null') {
    match = { steetId: street };
  } else {
    match = { date: date };
  }
  let wardmatch;

  if (wardId != 'null') {
    wardmatch = { wardId: wardId };
  } else {
    wardmatch = { active: true };
  }
  console.log(match);

  let values = await Product.aggregate([
    {
      $lookup: {
        from: 'trendproducts',
        localField: '_id',
        foreignField: 'productId',
        as: 'TrendProductdata',
        pipeline: [
          { $match: { date: date } },
          { $match: match },
          {
            $lookup: {
              from: 'streets',
              localField: 'steetId',
              foreignField: '_id',
              as: 'streetsdata',
              pipeline: [{ $match: wardmatch }],
            },
          },
          {
            $unwind: '$streetsdata',
          },
          {
            $group: {
              _id: null,
              averageQuantity: { $avg: '$Rate' },
              minprice: { $min: '$Rate' },
              maxprice: { $max: '$Rate' },
            },
          },
        ],
      },
    },
    {
      $unwind: '$TrendProductdata',
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        avg: '$TrendProductdata.averageQuantity',
        maxprice: '$TrendProductdata.maxprice',
        minprice: '$TrendProductdata.minprice',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Product.aggregate([
    {
      $lookup: {
        from: 'trendproducts',
        localField: '_id',
        foreignField: 'productId',
        as: 'TrendProductdata',
        pipeline: [
          { $match: { date: date } },
          { $match: match },
          {
            $lookup: {
              from: 'streets',
              localField: 'steetId',
              foreignField: '_id',
              as: 'streetsdata',
              pipeline: [{ $match: wardmatch }],
            },
          },
          {
            $unwind: '$streetsdata',
          },
          {
            $group: {
              _id: null,
              averageQuantity: { $avg: '$Rate' },
              minprice: { $min: '$Rate' },
              maxprice: { $max: '$Rate' },
            },
          },
        ],
      },
    },
    {
      $unwind: '$TrendProductdata',
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
        avg: '$TrendProductdata.averageQuantity',
        maxprice: '$TrendProductdata.maxprice',
        minprice: '$TrendProductdata.minprice',
      },
    },
  ]);
  return { values: values, total: total.length };
};

const getProductByProductIdFromTrendProduct = async (wardId, street, productId, date) => {
  let match;
  if (street != 'null') {
    match = { steetId: street };
  } else {
    match = { date: date };
  }
  let wardmatch;

  if (wardId != 'null') {
    wardmatch = { wardId: wardId };
  } else {
    wardmatch = { active: true };
  }
  console.log(match);
  let value = await TrendProduct.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }, { productId: { $eq: productId } }],
      },
    },
    {
      $lookup: {
        from: 'shops',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopData',
      },
    },
    {
      $unwind: '$shopData',
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'steetId',
        foreignField: '_id',
        as: 'streetData',
        pipeline: [{ $match: wardmatch }],
      },
    },
    {
      $unwind: '$streetData',
    },
    {
      $project: {
        shopName: '$shopData.SName',
        shopId: '$shopData._id',
        streetName: '$streetData.street',
        Rate: 1,
        lowestPrice: { $min: '$Rate' },
        highestPrice: { $max: '$Rate' },
      },
    },
  ]);
  return { value: value, total: value.length };
};

module.exports = {
  getStreetsByWardIdAndProducts,
  getProductByProductIdFromTrendProduct,
};
