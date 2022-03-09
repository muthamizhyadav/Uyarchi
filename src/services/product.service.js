const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

const createProduct = async(productBody)=>{
    return Product.create(productBody)
};

const getProductById = async (id) => {
    return Product.findById(id);
};

const queryProduct = async (filter, options) => {
    return Product.paginate(filter, options);
};

const updateProductById = async (productId, updateBody) => {
    let product = await getVendorById(productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'product not found');
    }
    vendor = await Vendor.findByIdAndUpdate({ _id: vendorId }, updateBody, { new: true });
    return vendor;
  };

module.exports = {
    createProduct,
}