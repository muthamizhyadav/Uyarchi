const httpStatus = require('http-status');
const { SetTrendsValue } = require('../models');
const ApiError = require('../utils/ApiError');

const createSetTrendsValue = async (trendsbody) => {
  const trends = await SetTrendsValue.create(trendsbody);
  return trends;
};

const getAllSetTrends = async () => {
  return SetTrendsValue.find();
};

const getSetTrendsValueById = async (id) => {
  const trends = await SetTrendsValue.findById(id);
  return trends;
};

const updateTrendsValueById = async (id, updateBody) => {
  let trends = await getSetTrendsValueById(id);
  if (!trends) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SetValue Not Found');
  }
  trends = await SetTrendsValue.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return trends;
};

const deleteTrendsSetValue = async (id) => {
  let trends = await getSetTrendsValueById(id);
  if (!trends) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SetValue Not Found');
  }
  (trends.active = false), (trends.archive = true);
  await trends.save();
};

module.exports = {
  createSetTrendsValue,
  getAllSetTrends,
  getSetTrendsValueById,
  updateTrendsValueById,
  deleteTrendsSetValue,
};
