const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ManageSalaryService = require('../services/manage.salary.service');

const createManageSalary = catchAsync(async (req, res) => {
  const managesalary = await ManageSalaryService.createManageSalary(req.body);
  res.send(managesalary);
});

module.exports = {
  createManageSalary,
};
