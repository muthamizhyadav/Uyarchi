const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const supplierService = require('../services/supplier.service');
const { NO_CONTENT } = require('http-status');
const tokenService = require('../services/token.service');

const createSupplier = catchAsync(async (req, res) => {
  const supplier = await supplierService.createSupplier(req.body);
  res.status(httpStatus.CREATED).send(supplier);
});

const UsersLogin = catchAsync(async (req, res) => {
  const users = await supplierService.UsersLogin(req.body);
  const tokens = await tokenService.generateAuthTokens(users);
  res.send({ users, tokens });
});

const getproductfromCallStatus = catchAsync(async (req, res) => {
  const getproduct = await supplierService.getproductfromCallStatus(req.params.date);
  res.send(getproduct);
});

const getSupplierWithApprovedstatus = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierWithApprovedstatus(req.params.date);
  res.send(supplier);
});

const getAllSupplier = catchAsync(async (req, res) => {
  const supplier = await supplierService.getAllSupplier();
  res.status(httpStatus.OK);
  res.send(supplier);
});

const getSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierById(req.params.supplierId);
  if (!supplier || supplier.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier Not Found');
  }
  res.send(supplier);
});

const productDealingWithsupplier = catchAsync(async (req, res) => {
  const products = await supplierService.productDealingWithsupplier(req.params.id, req.params.date);
  res.send(products);
});

const getDisableSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierService.getDisableSupplierById(req.params.id);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier Not Found');
  }
  res.send(supplier);
});

const getproductsWithSupplierId = catchAsync(async (req, res) => {
  const supplier = await supplierService.getproductsWithSupplierId(req.params.supplierId, req.params.date);
  res.send(supplier);
});

const getAllDisableSupplier = catchAsync(async (req, res) => {
  const supplier = await supplierService.getAllDisableSupplier();
  res.send(supplier);
});

const updateDisableSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierService.updateDisableSupplierById(req.params.id, req.body);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier Not Found');
  }
  res.send(supplier);
});

const updateSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierService.updateSupplierById(req.params.supplierId, req.body);
  if (!supplier || supplier.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier Not Found');
  }
  res.send(supplier);
});

const deleteSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierService.deleteSupplierById(req.params.supplierId);
  res.send();
});

const recoverById = catchAsync(async (req, res) => {
  const supplier = await supplierService.recoverById(req.params.supplierId);
  res.send(supplier);
});

const getSupplierAmountDetailsForSupplierBills = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierAmountDetailsForSupplierBills(req.params.page);
  res.send(supplier);
});

const getSupplierPaymentDetailsBySupplierId = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierPaymentDetailsBySupplierId(req.params.id);
  res.send(supplier);
});

const getSupplierPaymentDetailsByProductId = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierDataByProductId(req.params.id);
  res.send(supplier);
});

const getSupplierWith_Advanced = catchAsync(async (req, res) => {
  const supplier = await supplierService.getSupplierWith_Advanced()
  res.send(supplier)
})

const  otpVerify_Setpassword = catchAsync(async (req, res) => {
  const getproduct = await supplierService.otpVerify_Setpassword(req.body);
  res.send(getproduct);
});

const  Supplier_setPassword = catchAsync(async (req, res) => {
  const getproduct = await supplierService.Supplier_setPassword(req.params.id,req.body);
  res.send(getproduct);
});

const  forgotPassword = catchAsync(async (req, res) => {
  const getproduct = await supplierService.forgotPassword(req.body);
  res.send(getproduct);
});

module.exports = {
  createSupplier,
  getproductfromCallStatus,
  getAllSupplier,
  updateSupplierById,
  productDealingWithsupplier,
  recoverById,
  updateDisableSupplierById,
  getDisableSupplierById,
  getAllDisableSupplier,
  getproductsWithSupplierId,
  deleteSupplierById,
  getSupplierWithApprovedstatus,
  getSupplierById,
  getSupplierAmountDetailsForSupplierBills,
  getSupplierPaymentDetailsBySupplierId,
  getSupplierPaymentDetailsByProductId,
  getSupplierWith_Advanced,
  UsersLogin,
  otpVerify_Setpassword,
  Supplier_setPassword,
  forgotPassword,
};
