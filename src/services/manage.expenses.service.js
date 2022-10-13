const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ManageExpenses = require('../models/manage.expenses.model');
const moment = require('moment');

const createManageExpenses = async (body) => {
  let values = { ...body, ...{ date: moment().format('YYYY-MM-DD'), created: moment() } };
  const manageExpense = await ManageExpenses.create(values);
  return manageExpense;
};

const getAllManageExpenses = async (page) => {
  let values = await ManageExpenses.aggregate([
    {
      $sort: { date: -1 },
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
