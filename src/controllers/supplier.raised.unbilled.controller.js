const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const supplierraisedunbilled = require('../services/supplier.raised.unBilled.service');

const createSupplierRaised = catchAsync(async (req, res) => {
  const data = await supplierraisedunbilled.createRaisedUnbilled(req.body);
  res.send(data);
});

const getRaisedSupplier = catchAsync(async (req, res) => {
  const data = await supplierraisedunbilled.getRaisedSupplier();
  res.send(data);
});

module.exports = {
  createSupplierRaised,
  getRaisedSupplier,
};
