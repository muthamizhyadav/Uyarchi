const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const telecallerService = require('../services/telecallerAssign.service');

const createtelecallerAssignReassign = catchAsync(async (req, res) => {
  const data = await telecallerService.createtelecallerAssignReassign(req.body);
  res.send(data);
});

module.exports = { createtelecallerAssignReassign, };