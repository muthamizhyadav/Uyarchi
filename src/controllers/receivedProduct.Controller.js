const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ReceivedProductService = require('../services/receivedProduct.service');
const ReceivedStock = require('../models/receivedStock.model');
const CallStatus = require('../models/callStatus');
const createReceivedProduct = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.createReceivedProduct(req.body);
  if (receivedProduct) {
    req.body.callstatus.forEach(async (e) => {
      let callstatus = await CallStatus.findById(e.callstatusid);
      const row = {
        callstatusId: e.callstatusid,
        supplierId: req.body.supplierId,
        productId: callstatus.productid,
        date: req.body.date,
        time: req.body.time,
        groupId: receivedProduct.id,
        status: 'Acknowledged',
      };
      await ReceivedStock.create(row);
      await CallStatus.findByIdAndUpdate({ _id: e.callstatusid }, { StockReceived: 'Received' }, { new: true });
    });
  }
  res.send(receivedProduct);
});

const getAllWithPagination = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.getAllWithPagination(req.params.page, 'Acknowledged');
  res.send(receivedProduct);
});

const getAllWithPagination_loaded = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.getAllWithPagination(req.params.page, 'Loaded');
  res.send(receivedProduct);
});

const getAllWithPagination_billed = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.getAllWithPaginationBilled(req.params.page, 'Billed');
  res.send(receivedProduct);
});

const getAllWithPagination_billed_supplier = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.getAllWithPaginationBilled_Supplier(req.params.page, 'Billed');
  res.send(receivedProduct);
});

const updateReceivedProduct = catchAsync(async (req, res) => {
  let receivedProduct = await ReceivedProductService.updateReceivedProduct(req.params.id, req.body);
  res.send(receivedProduct);
});

const deleteReceivedOrdersById = catchAsync(async (req, res) => {
  const receivedProduct = await ReceivedProductService.deleteReceivedOrdersById(req.params.id);
  res.send(receivedProduct);
});

const BillNumber = catchAsync(async (req, res) => {
  const receivedProduct = await ReceivedProductService.BillNumber(req.params.id, req.body);
  res.send(receivedProduct);
});

const getSupplierBillsDetails = catchAsync(async (req, res) => {
  const receivedProduct = await ReceivedProductService.getSupplierBillsDetails(req.params.page);
  res.send(receivedProduct);
});

module.exports = {
  createReceivedProduct,
  getAllWithPagination,
  updateReceivedProduct,
  deleteReceivedOrdersById,
  getAllWithPagination_loaded,
  BillNumber,
  getAllWithPagination_billed,
  getAllWithPagination_billed_supplier,
  getSupplierBillsDetails,
};
