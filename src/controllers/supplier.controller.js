const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const supplierService = require('../services/supplier.service');

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
  res.send(supplier);
});

const updateSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierService.updateSupplierById(req.params.supplierId, req.body);
  res.send(supplier);
});

module.exports = {
  createSupplier,
  getAllSupplier,
  updateSupplierById,
  getSupplierById,
};
