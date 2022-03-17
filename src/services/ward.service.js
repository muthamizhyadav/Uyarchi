const httpStatus = require('http-status');
const { Ward } = require('../models');
const ApiError = require('../utils/ApiError');

const createWard = async (wardBody) => {
  return Ward.create(wardBody);
};

const getWardById = async (id) => {
  const ward = Ward.findOne({ active: true });
  if (!ward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ward Not Found');
  }
  return ward;
};

const querWard = async (filter, options) => {
  return Ward.paginate(filter, options);
};

const updatewardById = async (wardId, updateBody) => {
  let ward = await getWardById(wardId);
  if (!ward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ward not found');
  }
  ward = await Ward.findByIdAndUpdate({ _id: wardId }, updateBody, { new: true });
  return ward;
};

const deleteWardById = async (wardId) => {
  const ward = await getWardById(wardId);
  if (!ward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ward not found');
  }
  (ward.active = false), (ward.archive = true), await ward.save();
  return ward;
};

module.exports = {
  createWard,
  getWardById,
  updatewardById,
  deleteWardById,
};
