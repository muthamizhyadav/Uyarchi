const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const randomStockModel = require('../models/randomStock.model');
const { Product } = require('../models/product.model');

const getProduct = async () => {
  let productName = await Product.aggregate([
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        as: 'clonedProducts',
      },
    },
    {
      $project: {
        _id: 1,
        productTitle: 1,
      },
    },
  ]);
  return productName;
};

const createrandomStock = async (body) => {
  let stock = await randomStockModel.create(body);
  return stock;
};

const getAll = async (product, date) => {
  let match;
  if (product != 'null' && date != 'null') {
    match = [{ product: { $eq: product } }, { date: { $eq: date } }, { active: { $eq: true } }];
  } else if (product != 'null') {
    match = [{ product: { $eq: product } }, { active: { $eq: true } }];
   
  } else if (date != 'null') {
    match = [{ date: { $eq: date } }, { active: { $eq: true } }];
  } else {
    match = [{ product: { $ne: null } }, { active: { $eq: true } }];
  }

  let values = await randomStockModel.aggregate([
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'clonedProducts',
      },
    },
    {
      $unwind: '$clonedProducts',
    },
    {
      $project: {
        NSFQ1: 1,
        NSFQ2: 1,
        NSFQ3: 1,
        NSFW_Wastage: 1,
        product: 1,
        productTitle: '$clonedProducts.productTitle',
        _id: 1,
        date: 1,
        time: 1,
      },
    },
  ]);
  return values;
};

const getProductNameDetails = async () => {
  let values = await randomStockModel.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'productName',
      },
    },
    {
      $unwind: '$productName',
    },
    {
      $project: {
        productName: '$productName.productTitle',
        NSFQ1: 1,
        NSFQ2: 1,
        NSFQ3: 1,
        NSFW_Wastage: 1,
        wastedImageFile: 1,
        _id: 1,
        product: 1,
      },
    },
  ]);
  return values;
};

module.exports = {
  getProduct,
  createrandomStock,
  getAll,
  getProductNameDetails,
};
