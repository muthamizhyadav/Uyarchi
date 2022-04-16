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

const createBillRaise = catchAsync (async (req, res)=>{
  const {body} = req;
  const billRaise = await productService.createBillRaise(body);
  res.status(httpStatus.CREATED).send(billRaise),
  await billRaise.save();
})

const createMainWherehouseLoadingExecute = catchAsync (async (req, res)=>{
  const { body } = req
  const mwloading = await productService.createMainWherehouseLoadingExecute(body)
  res.status(httpStatus.CREATED).send(mwloading)
  await mwloading.save()
})

const createConfirmStock = catchAsync (async (req, res)=>{
  const { body } = req;
  const confirmStock = await productService.createConfirmStock(body, req.params);
  res.status(httpStatus.CREATED).send(confirmStock)
  await confirmStock.save()
})

const getconfirmStockById = catchAsync(async (req, res) => {
  const confirmStock = await productService.getConfrimById(req.params.confirmStockId);
  console.log(confirmStock)
  if (!confirmStock || confirmStock.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ConfirmStock not found');
  }
  res.send(confirmStock);
});

const getBillRaiseById = catchAsync (async (req, res)=>{
  const billRaise = await productService.getBillRaiseById(req.params.billRaiseId);
  if(!billRaise || billRaise.active === false){
    throw new ApiError(httpStatus.NOT_FOUND, "BillRaise Not Found");
  }
  res.send(billRaise)
})

const getMailWherehoustLoadingExecuteById = catchAsync(async (req, res)=>{
  const mwloading = await productService.getMailWherehoustLoadingExecuteById(req.params.mwLoadingId);
  if(!mwloading || mwloading.active === false){
    throw new ApiError(httpStatus.NOT_FOUND, 'MainWherehouse Loading Execute Not Fiund');
  }
  res.send(mwloading)
})

const getAllMailWherehoustLoadingExecute =  catchAsync(async (req, res)=>{
  const mwloading = await productService.getAllMailWherehoustLoadingExecute()
  res.send(mwloading)
})

const getAllBillRaised = catchAsync (async(req, res)=>{
  const billRaise = await productService.getAllBillRaised()
  res.send(billRaise)
})

const getAllConfirmStock = catchAsync(async (req, res)=>{
  const confirmStock = await productService.getAllConfirmStack();
  res.send(confirmStock)
})

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
  const stock = await productService.getStockBySupplierId(req.params.supplierId)
  res.send(stock)
})

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  res.json(product)
  console.log(product)
});

const updateBillRaiseById = catchAsync (async (req, res)=>{
  const billRaise = await productService.updateBillRaiseById(req.params.billRaiseId, req.body);
  res.send(billRaise)
})

const updateConfirmStock = catchAsync(async (req, res)=>{
  const confirmStock = await productService.updateConfirmById(req.params.confirmStockId, req.body)
  res.send(confirmStock)
})

const updateArrivedById = catchAsync(async (req, res)=>{
  const stock = await productService.updateArrivedById(req.params.id, req.body)
  res.send(stock)
})

const updateMainWherehouseLoadingExecuteById = catchAsync(async(req, res)=>{
  const mwloading = await productService.updateMainWherehouseLoadingExecuteById(req.params.mwLoadingId, req.body)
  res.send(mwloading)
})

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deleteMainWherehouseLoadingExecuteById = catchAsync(async (req, res)=>{
  await productService.deleteMainWherehouseLoadingExecuteById(req.params.mwLoadingId);
  res.status(httpStatus.NO_CONTENT).send();
})

const deleteConfirmStockById = catchAsync(async (req, res)=>{
  await productService.deleteConfirmStockById(req.params.confirmStockId);
  res.status(httpStatus.NO_CONTENT).send();
})

const deleteBillRaise = catchAsync(async (req, res)=>{
  await productService.deleteBillRaise(req.params.billRaiseId)
  res.status(httpStatus.NO_CONTENT).send()
})

module.exports = {
  createProduct,
  createStock,
  createBillRaise,
  getAllBillRaised,
  getBillRaiseById,
  updateBillRaiseById,
  deleteBillRaise,
  createMainWherehouseLoadingExecute,
  createConfirmStock,
  getAllConfirmStock,
  getAllMailWherehoustLoadingExecute,
  getconfirmStockById,
  updateConfirmStock,
  deleteConfirmStockById,
  getAllStock,
  getStockBySupplierId,
  getMailWherehoustLoadingExecuteById,
  getProducts,
  updateArrivedById,
  updateMainWherehouseLoadingExecuteById,
  getproduct,
  updateProduct,
  deleteProduct,
  deleteMainWherehouseLoadingExecuteById,
};
