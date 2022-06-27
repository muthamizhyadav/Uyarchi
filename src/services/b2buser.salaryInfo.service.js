const httpStatus = require('http-status');
const B2bUserSalaryInfo = require('../models/b2buserSalaryInfo.model');
const ApiError = require('../utils/ApiError');

const createB2bSalaryInfo = async (body) => {
  const { salaryInfo, userRole, userId } = body;
  let values = {};
  values = { ...salaryInfo, ...{ userRole: userRole, userId: userId } };
  let creation = await B2bUserSalaryInfo.create(values);
  return creation;
};

const getAllDataWithAggregation = async (page) => {
  let values = await B2bUserSalaryInfo.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: 'userId',
        foreignField: '_id',
        as: 'UserDatadata',
      },
    },
    {
      $unwind: '$UserDatadata',
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'userRole',
        foreignField: '_id',
        as: 'RoleData',
      },
    },
    {
      $unwind: '$RoleData',
    },
    { $skip: 10 * page },
    { $limit: 10 },
    {
      $project: {
        _id: 1,
        salary: 1,
        userStatus: 1,
        Type: 1,
        role: '$RoleData.roleName',
        userName: '$UserDatadata.name',
      },
    },
  ]);
  let total = await B2bUserSalaryInfo.find({ active: true }).count();
  return { values: values, total: total };
};

module.exports = {
  createB2bSalaryInfo,
  getAllDataWithAggregation,
};
