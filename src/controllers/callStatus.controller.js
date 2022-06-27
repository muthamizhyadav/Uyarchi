const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const CallStatusService = require('../services/callStatus');
const CallStatus = require('../models/callStatus');
const moment = require('moment');
const corrundDate = moment().format('DD-MM-YYYY');

const createCallStatus = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.createCallStatus(req.body);
  if (!callStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CallStatus Not Fount.');
  }
  res.status(httpStatus.CREATED).send(callStatus);
});

const getProductAndSupplierDetails = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.getProductAndSupplierDetails(req.params.date, req.params.page);
  res.send(callStatus);
});

const getCallStatusId = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.getAllConfirmStatus(req.params.id);
  res.send(callStatus);
});

const totalAggregation = catchAsync(async (req, res) => {
  const callstatus = await CallStatusService.totalAggregation();
  res.send(callstatus);
});

const AddVehicleDetailsInCallStatus = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.AddVehicleDetailsInCallStatus(req.params.id, req.body);
  if (req.files != null) {
    if (req.files.length != 0) {
      let path = '';
      req.files.forEach(function (files, index, arr) {
        path = 'images/stock/' + files.filename;
      });
      callStatus.weighbridgeBill = path;
    }
  }
  await callStatus.save();
  res.send(callStatus);
});

const getAcknowledgedData = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.getAcknowledgedData(req.params.date, req.params.page);
  res.send(callStatus);
});

const getOnlyLoadedData = catchAsync(async (req, res) => {
  const callstatus = await CallStatusService.getOnlyLoadedData(req.params.date, req.params.page);
  res.send(callstatus);
});

const getConfirmedStockStatus = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.getConfirmedStockStatus(req.params.date, req.params.page);
  res.send(callStatus);
});

const getCallStatusbyId = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.getCallStatusById(req.params.id);
  if (!callStatus || !callStatus.active === true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Call Status Not Found');
  }
  res.send(callStatus);
});

const updateCallStatusById = catchAsync(async (req, res) => {
  const billcount = await CallStatus.find({ billStatus: 'Billed', date: corrundDate }).count();
  const statusCheck = await CallStatus.findOne({ _id: req.params.id });
  if (statusCheck.billStatus == 'Billed') {
    throw new ApiError(httpStatus.CONFLICT, 'Already Billed');
  }
  let center = '';
  if (billcount < 9) {
    center = '000000';
  }
  if (billcount < 99 && billcount >= 9) {
    center = '00000';
  }
  if (billcount < 999 && billcount >= 99) {
    center = '0000';
  }
  if (billcount < 9999 && billcount >= 999) {
    center = '000';
  }
  if (billcount < 99999 && billcount >= 9999) {
    center = '00';
  }
  if (billcount < 999999 && billcount >= 99999) {
    center = '0';
  }
  let total = billcount + 1;
  let billid = center + total;
 
  const callStatus = await CallStatusService.updateCallStatusById(req.params.id, req.body, billid);
  res.send(callStatus);
});

const deleteBusinessById = catchAsync(async (req, res) => {
  await CallStatusService.deleteCallStatusById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getDataByVehicleNumber = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.getDataByVehicleNumber(
    req.params.vehicleNumber,
    req.params.date,
    req.params.page
  );
  res.send(callStatus);
});

const getAcknowledgedDataforLE = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.getAcknowledgedDataforLE(req.params.date, req.params.page);
  res.send(callStatus);
});

module.exports = {
  createCallStatus,
  getProductAndSupplierDetails,
  getCallStatusbyId,
  updateCallStatusById,
  totalAggregation,
  deleteBusinessById,
  getDataByVehicleNumber,
  AddVehicleDetailsInCallStatus,
  getCallStatusId,
  getAcknowledgedData,
  getOnlyLoadedData,
  getConfirmedStockStatus,
  getAcknowledgedDataforLE,
};
