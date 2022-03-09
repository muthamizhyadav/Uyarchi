const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const productService = require('../services/product.service');

const createProduct = catchAsync(async (req, res) => {
  const { body } = req;
  const product = await productService.createProduct(body);
  if(req.file){
    product.image = req.file.path
  }
  res.status(httpStatus.CREATED).send(product);
});



module.exports = {
    createProduct,
}