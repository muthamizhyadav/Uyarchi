const httpStatus = require('http-status');
const { Category, Subcategory } = require('../models/category.model');
const ApiError = require('../utils/ApiError');

const createcategory = async (categoryBody) => {
  return Category.create(categoryBody);
};

const subCreatecategory = async (subCategoryBody) => {
  return Subcategory.create(subCategoryBody);
};

const getcategoryById = async (id) => {
  const category = Category.findOne({ active: true });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category Not Found');
  }
  return category;
};

const getSubcategoryById = async (subcategoryId) => {
  const subcategory = Subcategory.findOne({ active: true });
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'subCategory Not Found');
  }
  return subcategory;
};

const querycategory = async (filter, options) => {
  return Category.paginate(filter, options);
};

const updatecategoryById = async (categoryId, updateBody) => {
  let cate = await getcategoryById(categoryId);
  if (!cate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  cate = await Category.findByIdAndUpdate({ _id: categoryId }, updateBody, { new: true });
  return cate;
};

const updateSubcategoryById = async (subcategoryId, updateBody) => {
  let subcate = await getSubcategoryById(subcategoryId);
  if (!subcate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'subcategoryId not found');
  }
  subcate = await Category.findByIdAndUpdate({ _id: subcategoryId }, updateBody, { new: true });
  return subcate;
};


const deletecategoryById = async (categoryId) => {
  const category = await getcategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  (category.active = false), (category.archive = true), await category.save();
  return category;
};

const deletesubcategoryById = async (categoryId) => {
  const subcategory = await getSubcategoryById(subcategoryId);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  (subcategory.active = false), (subcategory.archive = true), await subcategory.save();
  return subcategory;
};

module.exports = {
  createcategory,
  subCreatecategory,
  getSubcategoryById,
  updateSubcategoryById,
  deletesubcategoryById,
  getcategoryById,
  updatecategoryById,
  deletecategoryById,
  querycategory,
};
