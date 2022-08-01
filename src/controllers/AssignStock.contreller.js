const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const assignStockService = require('../services/AssignStock.service');

const createAssignStock = catchAsync(async (req, res) => {
  const assignStock = await assignStockService.createAssignStock(req.body);
  if (!assign) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assign Not Fount');
  }
  res.status(httpStatus.CREATED).send(assignStock);
});

module.exports = { createAssignStock };
