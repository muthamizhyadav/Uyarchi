const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

const createcategory = async (categoryBody) => {
  return Category.create(categoryBody);
};
const getcategoryById = async (id) => {
  const category = Category.findOne({ active: true });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found');
  }
  return category;
};

const querycategory = async (filter, options) => {
  return Category.paginate(filter, options);
};

const updatecategoryById = async (categoryId, updateBody) => {
  let cate = await getcategoryById(categoryId);
  if (!cate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  cate = await category.findByIdAndUpdate({ _id: categoryId }, updateBody, { new: true });
  return cate;
};

const deletecategoryById = async (categoryId) => {
  const category = await getcategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  (category.active = false), (category.archive = true), await category.save();
  return category;
};

module.exports = {
  createcategory,
  getcategoryById,
  updatecategoryById,
  deletecategoryById,
  querycategory,
};
