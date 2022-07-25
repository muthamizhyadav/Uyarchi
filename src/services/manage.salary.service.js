const httpStatus = require('http-status');
const { ManageSalary } = require('../models');
const ApiError = require('../utils/ApiError');

const createManageSalary = async (body) => {
  let managesalary = await ManageSalary.create(body);
  return managesalary;
};



module.exports = {
    createManageSalary
}