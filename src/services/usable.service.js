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
      $lookup: {
        from: 'assignstocks',
        localField: '_id',
        foreignField: 'usablestockId',
        as: 'assignstocks',
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
