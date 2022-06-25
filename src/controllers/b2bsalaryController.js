const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const b2busersalaryController = require('../services/b2buser.salaryInfo.service');
const b2buserSalary = require('../models/b2buserSalaryInfo.model');

const createB2bSalaryInfo = catchAsync(async (req, res) => {
  let center = '';
  let id = 'Emp';
  const salary = await b2buserSalary
    .find({
      active: true,
    })
    .count();
  if (salary < 9) {
    center = '0000';
    console.log('1');
  }
  if (salary < 99 && salary >= 9) {
    center = '000';
    console.log('2');
  }
  if (salary < 999 && salary >= 99) {
    center = '00';
    console.log('3');
  }
  if (salary < 9999 && salary >= 999) {
    center = '0';
    console.log('4');
  }
  console.log(salary);
  let total = salary + 1;

  let employeId = id + center + total;
  let salaryInfo;
  console.log(employeId);
  let userId = req.userId;
  let userRole = req.userRole;
  if (employeId != '') {
    salaryInfo = await b2busersalaryController.createB2bSalaryInfo(userId, userRole, req.body);
  }
  salaryInfo.empId = employeId;
  res.status(httpStatus.CREATED).send(salaryInfo);
});

const getAllDataWithAggregation = catchAsync(async (req, res) => {
  const salaryInfo = await b2busersalaryController.getAllDataWithAggregation(req.params.page);
  res.send(salaryInfo);
});

module.exports = {
  createB2bSalaryInfo,
  getAllDataWithAggregation,
};
