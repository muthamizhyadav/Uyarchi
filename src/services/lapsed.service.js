const httpStatus = require('http-status');
const Lapsed = require('../models/lapsed.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

const createLapsedDetails = async (body) => {
  let values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HHmmss') } };
  const createLapsed = await Lapsed.create(values);
  return createLapsed;
};

module.exports = {
  createLapsedDetails,
};
