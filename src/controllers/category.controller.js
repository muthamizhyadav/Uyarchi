const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const { body } = req;
  const category = await categoryService.createcategory(body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = 'images/category/' + files.filename;
    });
    category.categoryImage = path;
  }
  await category.save();
  res.status(httpStatus.CREATED).send(category);
});

const subcreateCategory = catchAsync(async (req, res) => {
  const { body } = req;
  const subcategory = await categoryService.subCreatecategory(body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = 'images/subcategory/' + files.filename;
    });
    subcategory.categoryImage = path;
  }
  await subcategory.save();
  res.status(httpStatus.CREATED).send(subcategory);
});

const getCategoryhDetailsById = catchAsync(async (req, res) => {
  const category = await categoryService.getcategoryById(req.params.categoryId);
  if (!category || category.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business_Details not found');
  }
  res.send(category);
});

const getSubCategoryhDetailsById = catchAsync(async (req, res) => {
  const subcategory = await categoryService.getSubcategoryById(req.params.subcategoryId);
  if (!subcategory || subcategory.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubCategory not found');
  }
  res.send(subcategory);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updatecategoryById(req.params.categoryId, req.body);
  res.send(category);
});

const updatesubCategory = catchAsync(async (req, res) => {
  const subcategory = await categoryService.updateSubcategoryById(req.params.subcategoryId, req.body);
  res.send(subcategory);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deletecategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteSubCategory = catchAsync(async (req, res) => {
  await categoryService.deletesubcategoryById(req.params.subcategoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCategory,
  subcreateCategory,
  getSubCategoryhDetailsById,
  updatesubCategory,
  deleteSubCategory,
  getCategoryhDetailsById,
  updateCategory,
  deleteCategory,
};
