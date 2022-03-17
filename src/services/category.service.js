const httpStatus = require('http-status');
const { category } = require('../models');
const ApiError = require('../utils/ApiError');

const createcategory = async (categoryBody) => {
    return category.create(categoryBody);
  };
  const getcategoryById = async (id) => {
    return category.findById(id);
  };

  const querycategory = async (filter, options) => {
    return category.paginate(filter, options);
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
    const category = await getcategoryById(productId);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    await category.remove();
    return category;
  };
  
  module.exports = {
      createcategory,
      getcategoryById,
      updatecategoryById,
      deletecategoryById,
      querycategory,

  };
  