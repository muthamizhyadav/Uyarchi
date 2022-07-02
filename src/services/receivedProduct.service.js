const httpStatus = require('http-status');
const { ReceivedOrders } = require('../models');
const ApiError = require('../utils/ApiError');
const ReceivedProduct = require('../models/receivedProduct.model');
const ReceivedStock = require('../models/receivedStock.model');
const createReceivedProduct = async (body) => {
  let Rproduct = await ReceivedProduct.create(body);
  return Rproduct;
};

const getAllWithPagination = async (page) => {
  let value = await ReceivedProduct.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'Acknowledged' } }],
      },
    },
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Count: { $sum: 1 } } }],
        as: 'ReceivedData',
      },
    },
    {
      $unwind: '$ReceivedData',
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
      $project: {
        _id: 1,
        status: 1,
        vehicleType: 1,
        vehicleNumber: 1,
        driverName: 1,
        driverNumber: 1,
        weighBridgeEmpty: 1,
        weighBridgeLoadedProduct: 1,
        supplierId: 1,
        date: 1,
        time: 1,
        supplierName: '$supplierData.primaryContactName',
        Count: '$ReceivedData.Count',
      },
    },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
  ]);
  let total = await ReceivedProduct.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'Acknowledged' } }],
      },
    },
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Count: { $sum: 1 } } }],
        as: 'ReceivedData',
      },
    },
    {
      $unwind: '$ReceivedData',
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
  ]);
  return { values: value, total: total.length };
};

const updateReceivedProduct = async (id, updateBody) => {
  return 'update';
};

const deleteReceivedProduct = async (id) => {
  return 'gg';
};

module.exports = {
  createReceivedProduct,
  getAllWithPagination,
  updateReceivedProduct,
  deleteReceivedProduct,
};
