const BillAdjService = require('../services/Bill.Adj.service');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

// create Bill_Adjustment Flow
const createBillAdj = catchAsync(async (req, res) => {
  const data = await BillAdjService.createBill_Adjustment(req.body);
  res.send(data);
});

// get BillAdjustment by Id

const getBillAdjustmentById = catchAsync(async (req, res) => {
  const data = await BillAdjService.getBillAdjustment_ById(req.params.id);
  res.send(data);
});

// get ShopOrderBills

const getCustomer_bills = catchAsync(async (req, res) => {
  const data = await BillAdjService.getCustomer_bills();
  res.send(data);
});

module.exports = {
  createBillAdj,
  getBillAdjustmentById,
  getCustomer_bills,
};
