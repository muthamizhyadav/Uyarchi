const httpStatus = require('http-status');
const { ReceivedOrders } = require('../models');
const ApiError = require('../utils/ApiError');
const ReceivedProduct = require('../models/receivedProduct.model');
const ReceivedStock = require('../models/receivedStock.model');
const { Product } = require('../models/product.model');
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

const getDetailsByProductId = async (productId, date, page) => {
  const values = await ReceivedStock.aggregate([
    {
      $match: {
        $and: [{ productId: { $eq: productId } }, { date: { $eq: date } }, { status: { $in: ['Loaded', 'Billed'] } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplierData',
      },
    },
    {
      $unwind: '$supplierData',
    },
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
        incomingQuantity: 1,
        incomingWastage: 1,
        supplierId: 1,
        FQ1: 1,
        FQ2: 1,
        FQ3: 1,
        segStatus: 1,
        seg_wastage: 1,
        supplierName: '$supplierData.primaryContactName',
        supplierNumber: '$supplierData.primaryContactNumber',
        productName: '$productData.productTitle',
      },
    },
  ]);
  let product = await Product.findById(productId);
  return { values: values, product: product.productTitle, date: date };
};

module.exports = { getDataById, updateReceivedStockById, getDataByLoading, getDetailsByProductId };
