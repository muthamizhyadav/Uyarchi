const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const supplierService = require('../services/supplier.service');
const { NO_CONTENT } = require('http-status');

const createSupplier = catchAsync(async (req, res) => {
  const supplier = await supplierService.createSupplier(req.body);
  res.status(httpStatus.CREATED).send(supplier);
});

const getAllSupplier = catchAsync(async (req, res) => {
  const supplier = await supplierService.getAllSupplier();
  res.status(httpStatus.OK);
  res.send(supplier);
});

const getSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierById(req.params.supplierId);
  if(!supplier || supplier.active == false){
    throw new ApiError(httpStatus.NOT_FOUND, "Supplier Not Found");
  }
  res.send(supplier);
});

const productDealingWithsupplier = catchAsync (async (req, res)=>{
  const products = await supplierService.productDealingWithsupplier(req.params.id)
  res.send(products)
})

const getDisableSupplierById = catchAsync (async (req, res)=>{
  const supplier = await supplierService.getDisableSupplierById(req.params.id)
  if(!supplier){
    throw new ApiError(httpStatus.NOT_FOUND, "Supplier Not Found")
  }
  res.send(supplier)
})

const getAllDisableSupplier = catchAsync (async (req, res)=>{
  const supplier = await supplierService.getAllDisableSupplier()
  res.send(supplier)
})

const updateDisableSupplierById = catchAsync (async (req, res)=>{
  const supplier = await supplierService.updateDisableSupplierById(req.params.id, req.body)
  if(!supplier){
    throw new ApiError(httpStatus.NOT_FOUND, "Supplier Not Found")
  }
  res.send(supplier)
})

const updateSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierService.updateSupplierById(req.params.supplierId, req.body);
  if(!supplier || supplier.active == false){
    throw new ApiError(httpStatus.NOT_FOUND, "Supplier Not Found")
  }
  res.send(supplier);
});

const deleteSupplierById = catchAsync (async (req, res)=>{
  const supplier = await supplierService.deleteSupplierById(req.params.supplierId)
  res.send()
})

const recoverById = catchAsync(async (req,res)=>{
  const supplier = await supplierService.recoverById(req.params.supplierId)
  res.send()
})

module.exports = {
  createSupplier,
  getAllSupplier,
  updateSupplierById,
  productDealingWithsupplier,
  recoverById,
  updateDisableSupplierById,
  getDisableSupplierById,
  getAllDisableSupplier,
  deleteSupplierById,
  getSupplierById,
};
