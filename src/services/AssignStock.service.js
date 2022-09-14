const httpStatus = require('http-status');
const AssignStock = require('../models/AssignStock.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const createAssignStock = async (bodyData) => {
  let values = {
    ...bodyData,
    ...{ created: moment(), date: moment().format('DD-MM-YYYY'), time: moment().format('hh:mm a') },
  };
  return AssignStock.create(values);
};

module.exports = { createAssignStock };
