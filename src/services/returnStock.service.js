const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const ReturnStock = require('../models/returnStocks.model');

const create_ReturnStock = async (body) => {
  let values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HHmmss') } };
  let create = await ReturnStock.create(values);
  return create;
};

module.exports = {
  create_ReturnStock,
};
