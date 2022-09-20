const httpStatus = require('http-status');
const CustomeIssues = require('../models/customerIssues.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

const createCustomerIssues = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  const customerissues = await CustomeIssues.create(values);
  return customerissues;
};


const productData = async() =>{
  let data = await CustomeIssues.aggregate([
    // {
    //   $match: { _id: id },
    // },
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
        from: 'shoporderclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shoporderclonesData',
      },
    },
    {
      $unwind: '$shoporderclonesData',
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shoporderclonesData.shopId',
        foreignField: '_id',
        as: 'b2bshopclonesData',
      },
    },
    {
      $unwind: '$b2bshopclonesData',
    },
    {
      $project: {
        product:'$productsData.productTitle',
        price:1,
        quantity:1,
        total:1,
        issue:1,
        OrderId:'$shoporderclonesData.OrderId',
        SName:'$b2bshopclonesData.SName',
      },
    },
  ])
  return data
}


module.exports = {
  createCustomerIssues,
  productData,
};
