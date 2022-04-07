const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');

const createProduct = catchAsync(async (req, res) => {
  const { body } = req;
  const product = await productService.createProduct(body);
  if (req.files) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = "images/"+files.filename;
    });
    path = path.substring(0, path.lastIndexOf(','));
    product.image = path;
  }
  res.status(httpStatus.CREATED).send(product);
  await product.save();
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['productTitle', 'unit']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await productService.queryProduct(filter, options);
  res.send(result);
});

const getproduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product || product.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  getProducts,
  getproduct,
  updateProduct,
  deleteProduct,
};
