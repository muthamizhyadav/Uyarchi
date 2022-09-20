const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const CustomerIssuesService = require('../services/customerIssues.service');

const createCustomerIssues = catchAsync(async (req, res) => {
  const customerIssues = await CustomerIssuesService.createCustomerIssues(req.body);
  res.send(customerIssues);
});

const getAll = catchAsync(async (req, res) => {
  const data = await CustomerIssuesService.productData();
  res.send(data);
});
module.exports = {
  createCustomerIssues,
  getAll,
};
