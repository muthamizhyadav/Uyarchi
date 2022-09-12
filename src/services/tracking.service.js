const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Tracking = require('../models/tracking.model');
const { Users } = require('../models/B2Busers.model');
const moment = require('moment');

const createTracking = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  let users = await Tracking.findOne({ userId: body.userId });
  if (!users) {
    await Tracking.create(values);
  } else {
    await Tracking.findByIdAndUpdate({ _id: users._id }, values, { new: true });
  }
  return 'Success';
};

const updateTrackingById = async (id, body) => {
  let values = await Tracking.findById(id);
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tracking Not Found');
  }
  values = await Tracking.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return values;
};

const getTrackingByUserById = async (userId) => {
  let values = await Tracking.findOne({ userId: userId });
  if (!values) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return values;
};

module.exports = {
  createTracking,
  updateTrackingById,
  getTrackingByUserById,
};
