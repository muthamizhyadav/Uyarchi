const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const b2bBillStatusService = require('../services/b2bBillStatus.service');

const createB2bBillStatus = catchAsync(async (req, res) => {
  const billStatus = await b2bBillStatusService.createB2bBillStatus(req.body);
  res.status(httpStatus.CREATED).send(billStatus);
});

const getDataForAccountExecutive = catchAsync(async (req, res) => {
  const billStatus = await b2bBillStatusService.getDataForAccountExecutive(req.params.page);
  res.send(billStatus);
});

module.exports = { createB2bBillStatus, getDataForAccountExecutive };
