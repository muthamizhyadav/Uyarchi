const httpStatus = require('http-status');
const { category } = require('../models');
const ApiError = require('../utils/ApiError');

const createcategory = async (categoryBody) => {
  return category.create(categoryBody);
};
module.exports = {
  createcategory,
};
