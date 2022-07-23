const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ManageExpenses = require('../models/manage.expenses.model');

const createManageExpenses = async (body) => {
  const manageExpense = await ManageExpenses.create(body);
  return manageExpense;
};

const getAllManageExpenses = async (page) => {
  let values = await ManageExpenses.aggregate([
    {
      $sort: { date: 1 },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await ManageExpenses.find().count();
  return { values: values, total: total };
};

module.exports = {
  createManageExpenses,
  getAllManageExpenses,
};
