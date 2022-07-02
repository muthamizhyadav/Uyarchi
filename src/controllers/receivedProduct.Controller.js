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
  let receivedProduct = await ReceivedProductService.getAllWithPagination(req.params.page);
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

module.exports = {
  createReceivedProduct,
  getAllWithPagination,
  updateReceivedProduct,
  deleteReceivedOrdersById,
};
