const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const attendanceModel = require('../models/b2bAttendance.model');
const salaryInfo = require('../models/b2buserSalaryInfo.model');

const createAttendance = async (attendanceBody) => {
  const { month, ApprovedAbsentDays, leaveReduceAmounts, payingSalary, b2bUser } = attendanceBody;

  let total = month - ApprovedAbsentDays;
  let userSalary = await salaryInfo.findOne({ userId: b2bUser });
  let oneDaySalary = userSalary.salary / month;
  let reduceSalary = ApprovedAbsentDays * oneDaySalary;
  let payingSalaryAmount = userSalary.salary - reduceSalary;
  let values = { ...attendanceBody, ...{ TotalWorkingDays: total, leaveReduceAmounts: Math.round(reduceSalary), payingSalary: Math.round(payingSalaryAmount)} };
  let attendance = await attendanceModel.create(values)

  return attendance;
};

const getAll = async () => {
  return attendanceModel.find();
};

module.exports = {
  createAttendance,
  getAll,
};
