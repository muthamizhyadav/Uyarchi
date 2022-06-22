const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ManageExpenses = require('../models/manage.expenses.model');

const createManageExpenses = async (body) => {
  const manageExpense = await ManageExpenses.create(body);
  return manageExpense;
};

const getAllManageExpenses = async () => {
  let values = await ManageExpenses.aggregate([
    {
      $sort: { date: 1 },
    },
  ]);
  return values;
};

module.exports = {
  createManageExpenses,
  getAllManageExpenses,
};
