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
    product.image = path;
  }
  await product.save();
  res.status(httpStatus.CREATED).send(product);
  
});

const createStock = catchAsync (async (req, res)=>{
  const { body } =req;
  const stock = await productService.createStock(body);
  await stock.save();
  res.status(httpStatus.CREATED).send(stock)
});

const getAllStock = catchAsync(async (req, res)=>{
  const stock = await productService.getAllStock();
  res.send(stock)
})

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
const getStockBySupplierId = catchAsync(async (req, res)=>{
  const { body } = req;
  const stock = await productService.getStockBySupplierId(body)
  res.send(stock)
})

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.json(product)
  console.log(product)
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createProduct,
  createStock,
  getAllStock,
  getStockBySupplierId,
  getProducts,
  getproduct,
  updateProduct,
  deleteProduct,
};
