const httpStatus = require('http-status');
const { usableStock } = require('../models/usableStock.model');
const ApiError = require('../utils/ApiError');

const createUsableStock = async (body) => {
  let usable = await UsableStock.create(body);
  return usable;
};

const getAllUsableStock = async () => {
  return await UsableStock.find();
};

const getUsableStockById = async (id) => {
  let usable = await UsableStock.findById(id);
  if (!usable || usable.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Usable Stock Not Found');
  }
  return usable;
};

const updateUsableStockbyId = async (id, updateBody) => {
  let usable = await UsableStock.findById(id);
  if (!usable || usable.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Usable Stock Not Found');
  }
  usable = await UsableStock.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return usable;
};

const getAssignStockbyId = async (id) => {
  return await usableStock.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'assignstocks',
        localField: '_id',
        foreignField: 'usablestockId',
        pipeline: [{ $match: { type: 'b2b' } }, { $group: { _id: null, Total: { $sum: '$quantity' } } }],
        as: 'b2bAssign',
      },
    },
    {
      $lookup: {
        from: 'assignstocks',
        localField: '_id',
        foreignField: 'usablestockId',
        pipeline: [{ $match: { type: 'b2c' } }, { $group: { _id: null, Total: { $sum: '$quantity' } } }],
        as: 'b2cAssign',
      },
    },
    {
      $lookup: {
        from: 'assignstocks',
        localField: '_id',
        foreignField: 'usablestockId',
        as: 'assignHistory',
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productsdata',
      },
    },
    {
      $unwind: '$productsdata',
    },
    {
      $project: {
        _id: 1,
        b2cassignTotal: { $sum: '$b2cAssign.Total' },
        b2bassignTotal: { $sum: '$b2bAssign.Total' },
        b2bStock: 1,
        b2cStock: 1,
        productId: 1,
        date: 1,
        time: 1,
        FQ1: 1,
        FQ2: 1,
        FQ3: 1,
        totalStock: 1,
        wastage: 1,
        ProductName: '$productsdata.productTitle',
        assignHistory: '$assignHistory',
      },
    },
  ]);
};

module.exports = {
  createUsableStock,
  getAllUsableStock,
  getUsableStockById,
  updateUsableStockbyId,
  getAssignStockbyId,
};
