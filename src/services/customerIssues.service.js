const httpStatus = require('http-status');
const CustomeIssues = require('../models/customerIssues.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

const createCustomerIssues = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  const customerissues = await CustomeIssues.create(values);
  return customerissues;
};

module.exports = {
  createCustomerIssues,
};
