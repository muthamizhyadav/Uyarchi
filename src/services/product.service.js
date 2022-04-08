const httpStatus = require('http-status');
const { Product, Stock } = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const Supplier = require('../models/supplier.model')

const createProduct = async (productBody) => {
  let { needBidding, biddingStartDate, biddingStartTime, biddingEndDate, biddingEndTime, maxBidAomunt, minBidAmount } =
    productBody;
  if (needBidding === 'no') {
    (biddingStartDate = null),
      (biddingStartTime = null),
      (biddingEndDate = null),
      (biddingEndTime = null),
      (maxBidAomunt = null),
      (minBidAmount = null);
  } else {
    biddingStartDate, biddingStartTime, biddingEndDate, biddingEndTime, maxBidAomunt, minBidAmount;
  }
  return Product.create(productBody);
};

const createStock = async(stockbody) =>{
  const  { supplierId } = stockbody
  let values = {}
  const supp = await Supplier.findById(supplierId)
  values = {...stockbody, ...{supplierName:supp.supplierName}}
  return Stock.create(values)
}

const getAllStock = async()=>{
  return Stock.find()
}

const getProductById = async (id) => {
  return Product.findById(id);
};

const queryProduct = async (filter, options) => {
  return Product.paginate(filter, options);
};

const updateProductById = async (productId, updateBody) => {
  let prod = await getProductById(productId);
  if (!prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  prod = await Product.findByIdAndUpdate({ _id: productId }, updateBody, { new: true });
  return prod;
};
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  (product.active = false), (product.archive = true), await product.save();
  return product;
};
module.exports = {
  createProduct,
  createStock,
  getAllStock,
  getProductById,
  updateProductById,
  deleteProductById,
  queryProduct,
};
