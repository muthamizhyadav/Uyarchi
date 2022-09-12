const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Tracking = require('../models/tracking.model');
const { Users } = require('../models/B2Busers.model');
const moment = require('moment');

const createTracking = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  console.log(values);
  let users = await Users.findById(body.userId);

  if (!users) {
    await Tracking.create(values);
  } else {
    await Tracking.findByIdAndUpdate({ _id: body.userId }, values, { new: true });
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

module.exports = {
  createTracking,
  updateTrackingById,
};
