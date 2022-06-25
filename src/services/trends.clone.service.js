const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const TrendsClone = require('../models/trendsClone.model');

const createTrendsClone = async (body) => {
  const trendsClone = await TrendsClone.create(body);
  return trendsClone;
};

const TrendsClonePagination = async (id) => {
  return TrendsClone.aggregate([
    {
      $sort: { Uid: 1 },
    },
    { $skip: 5 * id },
    { $limit: 5 },
  ]);
};

const getAllTrendsClone = async () => {
  return TrendsClone.find({ active: true });
};

const getTrendsCloneById = async (TrendsCloneId) => {
  const TrendsClone = await TrendsClone.findById(TrendsCloneId);
  if (!TrendsClone || TrendsClone.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrendsClone Not Found');
  }
  return TrendsClone;
};

const updateTrendsCloneById = async (TrendsCloneId, updateBody) => {
  let TrendsClone = await getTrendsCloneById(TrendsCloneId);
  if (!TrendsClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrendsClone not found');
  }
  console.log(TrendsClone);

  TrendsClone = await TrendsClone.findByIdAndUpdate({ _id: TrendsCloneId }, updateBody, { new: true });
  return TrendsClone;
};

const deleteTrendsCloneById = async (TrendsCloneId) => {
  const TrendsClone = await getTrendsCloneById(TrendsCloneId);
  if (!TrendsClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'TrendsClone not found');
  }
  (TrendsClone.active = false), (TrendsClone.archive = true), await TrendsClone.save();
  return TrendsClone;
};

const updateProductFromTrendsClone = async (id, updateBody) => {
  return await TrendsClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
};

module.exports = {
  createTrendsClone,
  TrendsClonePagination,
  getAllTrendsClone,
  getTrendsCloneById,
  updateProductFromTrendsClone,
  updateTrendsCloneById,
  deleteTrendsCloneById,
};
