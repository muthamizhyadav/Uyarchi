const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
    const category = await categoryService.createcategory(req.body);
    res.status(httpStatus.CREATED).send(category);
});
  module.exports = {
    createCategory
  };