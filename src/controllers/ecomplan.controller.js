const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Ecomserive = require('../services/ecomplan.service');

const create_Plans = catchAsync(async (req, res) => {
  const value =await Ecomserive.create_Plans(req);
  res.send(value);
});

module.exports = {
  create_Plans,
};
