const callHistoryService = require('../services/b2b.callHistory.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createCallHistory = catchAsync(async (req, res) => {
  const callHistory = await callHistoryService.createCallHistory(req.body);
  res.send(callHistory);
});


const createcallHistoryWithTypes = catchAsync(async (req, res) => {
  const history = await callHistoryService.createcallHistoryWithType(req.body);
  res.send(history)
});

const getAll = catchAsync(async (req, res) => {
  const callhistory = await callHistoryService.getAll();
  res.send(callhistory);
});

const getShop = catchAsync(async (req, res) => {
  const shopId = await callHistoryService.getShop();
  res.send(shopId);
});

const getById = catchAsync(async (req, res) => {
  const callCount = await callHistoryService.getById(req.params.id);
  res.send(callCount);
});

const getAllPage = catchAsync(async (req, res) => {
  const call = await callHistoryService.getShop(req.params.page);
  res.send(call);
});

const updateCallingStatus = catchAsync(async (req, res) => {
  let userId = req.userId;
  console.log(userId);
  const callingStatus = await callHistoryService.updateStatuscall(req.params.id, userId, req.body);
  res.send(callingStatus);
});

const updateStatuscall = catchAsync(async (req, res) => {
  const callstatus = await callHistoryService.updateStatuscall(req.params.id, req.body);
  res.send(callstatus);
});

const createShopByOwner = catchAsync(async (req, res) => {
  const shops = await callHistoryService.createShopByOwner(req.body);
  res.send(shops);
});

module.exports = {
  createCallHistory,
  getAll,
  getShop,
  getAllPage,
  getById,
  updateCallingStatus,
  updateStatuscall,
  createShopByOwner,
  createcallHistoryWithTypes,
};
