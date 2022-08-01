const httpStatus = require('http-status');
const AssignStock = require('../models/AssignStock.model');
const ApiError = require('../utils/ApiError');

const createAssignStock = async (bodyData) => {
  return AssignStock.create(bodyData);
};



module.exports = { createAssignStock };
