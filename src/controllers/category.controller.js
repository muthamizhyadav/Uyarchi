const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createcategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

const getCategoryhDetailsById = catchAsync(async (req, res) => {
  const category = await categoryService.getcategoryById(req.params.categoryId);
  if (!category || category.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business_Details not found');
  }
  res.send(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updatecategoryById(req.params.categoryId, req.body);
  res.send(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deletecategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createCategory,
  getCategoryhDetailsById,
  updateCategory,
  deleteCategory,
};
