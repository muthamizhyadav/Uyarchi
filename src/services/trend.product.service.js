const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const TrendProduct = require('../models/trendproduct.model');
const { Product } = require('../models/product.model');

const getStreetsByWardIdAndProducts = async (wardId, street, date, page) => {
  console.log(date, 'sdfsa');

  let match;
  if (street != 'null') {
    match = { steetId: street };
    //  { $expr: { $and: [{ $eq: [date, date] }, { $eq: [steetId, street] }] } };
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

// const getStreetsByWardIdAndProducts = async (wardId, date, page) => {
//   console.log(wardId);
//   let match;
//   if (wardId != 'null') {
//     match = [{ 'streetsdata.wardId': { $eq: wardId } }];
//     console.log('dfwfd');
//   }
//   let values = await TrendProduct.aggregate([
//     {
//       $match: {
//         $and: [{ date: { $eq: date } }],
//       },
//     },
//     {
//       $lookup: {
//         from: 'streets',
//         localField: 'steetId',
//         foreignField: '_id',
//         as: 'streetsdata',
//       },
//     },
//     {
//       $unwind: '$streetsdata',
//     },
//     {
//       $lookup: {
//         from: 'products',
//         localField: 'productId',
//         foreignField: '_id',
//         as: 'ProductData',
//       },
//     },
//     {
//       $unwind: '$ProductData',
//     },

//     {
//       $lookup: {
//         from: 'wards',
//         localField: 'streetsdata.wardId',
//         foreignField: '_id',
//         as: 'wardDataData',
//       },
//     },
//     {
//       $unwind: '$wardDataData',
//     },

//     // product details Lookup
//     // {
//     //   $lookup: {
//     //     from: 'products',
//     //     localField: 'productId',
//     //     foreignField: '_id',
//     //     as: 'productData',
//     //   },
//     // },
//     // {
//     //   $unwind: '$productData',
//     // },

//     {
//       $match: {
//         $and: match,
//       },
//     },

//     {
//       $project: {
//         Rate: 1,
//         AvgRate:{ $avg: "$Rate"},
//         MaxRate:{ $max: "$Rate"},
//         MinRate:{ $min: "$Rate"},
//         WardData: '$wardDataData',
//         streetData: '$streetsdata',
//         productData: '$ProductData',
//       },
//     },

//     { $skip: 10 * page },
//     { $limit: 10 },
//   ]);
//   let cal = await TrendProduct.aggregate([
//     {
//       $group: {
//         _id: null,
//         AvgRate: { $avg: '$Rate' },
//         MaxRate: { $max: '$Rate' },
//         minRate: { $min: '$Rate' },
//       },
//     },
//   ]);
//   let total = await TrendProduct.find({ date: date }).count();
//   return { values: values, total: total, cal: cal };
// };

module.exports = {
  getStreetsByWardIdAndProducts,
};
