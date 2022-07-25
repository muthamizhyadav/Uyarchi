const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const attendanceModel = require('../models/b2bAttendance.model');
const salaryInfo = require('../models/b2buserSalaryInfo.model');

const createAttendance = async (attendanceBody) => {
  const { days, ApprovedAbsentDays, leaveReduceAmounts, payingSalary, b2bUser } = attendanceBody;

  let total = days - ApprovedAbsentDays;
  let userSalary = await salaryInfo.findOne({ userId: b2bUser });
  console.log(userSalary);
  if (!userSalary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  let oneDaySalary = userSalary.salary / days;
  let reduceSalary = ApprovedAbsentDays * oneDaySalary;
  let payingSalaryAmount = userSalary.salary - reduceSalary;
  let values = {
    ...attendanceBody,
    ...{
      TotalWorkingDays: total,
      leaveReduceAmounts: Math.round(reduceSalary),
      payingSalary: Math.round(payingSalaryAmount),
    },
  };
  let attendance = await attendanceModel.create(values);

  return attendance;
};

const getAll = async (page) => {
  let values = await attendanceModel.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: 'b2bUser',
        foreignField: '_id',
        as: 'userData',
      },
    },
    { $unwind: '$userData' }, //array to object
    {
      $project: {
        month: 1,
        days: 1,
        TotalAbsentDays: 1,
        ApprovedAbsentDays: 1,
        TotalWorkingDays: 1,
        leaveReduceAmounts: 1,
        payingSalary: 1,
        userName: '$userData.name',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await attendanceModel.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: 'b2bUser',
        foreignField: '_id',
        
        as: 'userData',
      },
    },
    { $unwind: '$userData' },
    // {
    //   $project: {

    //   }
    // }
  ]);
  return { values: values, total: total.length };
};


const updateAttendance = async (id, updatebody) => {
  let attendance = await attendanceModel.findById(id)
  if (!attendance) {
      throw new ApiError(httpStatus.NOT_FOUND, 'attendance Not found')
  }
  attendance = await attendance.findByIdAndUpdate({ _id: id }, updatebody, { new: true })
  return attendance
}


const getSalaryInfo = async(page)=>{
  let values = await attendanceModel.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: '_id',
        as: 'salaryData ',
      },
    },{$unwind: '$salaryData'},
    {$skip: 10 * page},
    {$limit:10},
  ])
  return values;
}

module.exports = {
  createAttendance,
  getAll,
  updateAttendance,
  getSalaryInfo,
};
