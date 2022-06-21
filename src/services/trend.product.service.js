const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const TrendProduct = require('../models/trendproduct.model');

const getStreetsByWardIdAndProducts = async (wardId, date, page) => {
  console.log(wardId);
  let match;
  if (wardId != 'null') {
    match = [{ 'streetsdata.wardId': { $eq: wardId } }];
    console.log('dfwfd');
  }
  let values = await TrendProduct.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }],
      },
    },
    {
      $lookup: {
        from: 'streets',
        localField: 'steetId',
        foreignField: '_id',
        as: 'streetsdata',
      },
    },
    {
      $unwind: '$streetsdata',
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
      $unwind: '$ProductData',
    },

    {
      $lookup: {
        from: 'wards',
        localField: 'streetsdata.wardId',
        foreignField: '_id',
        as: 'wardDataData',
      },
    },
    {
      $unwind: '$wardDataData',
    },

    // product details Lookup
    // {
    //   $lookup: {
    //     from: 'products',
    //     localField: 'productId',
    //     foreignField: '_id',
    //     as: 'productData',
    //   },
    // },
    // {
    //   $unwind: '$productData',
    // },

    {
      $match: {
        $and: match,
      },
    },

    {
      $project: {
        Rate: 1,
        WardData: '$wardDataData',
        streetData: '$streetsdata',
        productData: '$ProductData',
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
  let total = await TrendProduct.find({ date: date }).count();
  return { values: values, total: total, cal: cal };
};

module.exports = {
  getStreetsByWardIdAndProducts,
};
