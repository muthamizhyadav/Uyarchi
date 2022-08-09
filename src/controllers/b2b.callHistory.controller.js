const callHistoryService = require('../services/b2b.callHistory.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const createCallHistory = catchAsync(async (req, res) => {
  const callHistory = await callHistoryService.createCallHistory(req.body);
  res.send(callHistory);
});

const createcallHistoryWithTypes = catchAsync(async (req, res) => {
  let userId = req.userId;
  const history = await callHistoryService.createcallHistoryWithType(req.body, userId);
  res.send(history);
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
  let userId = req.userId;
  let userRole = req.userRole;
  const call = await callHistoryService.getShop(req.params.date,req.params.status, req.params.page, userId,  userRole);
  res.send(call);
});

const updateCallingStatus = catchAsync(async (req, res) => {
  let userId = req.userId;
  console.log(userId);
  const callingStatus = await callHistoryService.updateStatuscall(req.params.id, userId, req.body);
  // throw new ApiError(httpStatus.UNAUTHORIZED, 'OnCall');
  res.send(callingStatus);
});

const updateStatuscall = catchAsync(async (req, res) => {
  const callstatus = await callHistoryService.updateStatuscall(req.params.id, req.body);
  res.send(callstatus);
});

const updateOrderedStatus = catchAsync(async (req, res) => {
  const orderstatus = await callHistoryService.updateOrderStatus(req.params.id);
  res.send(orderstatus);
});

const createShopByOwner = catchAsync(async (req, res) => {
  const shops = await callHistoryService.createShopByOwner(req.body);
  res.send(shops);
});

const callingStatusreport = catchAsync(async (req, res) => {
  const shops = await callHistoryService.callingStatusreport();
  res.send(shops);
});

const getOncallfromshops = catchAsync(async (req, res) => {
  let userId = req.userId;
  const shops = await callHistoryService.getOncallfromshops(userId);
  res.send(shops);
});

const checkvisitOncallStatus = catchAsync(async (req, res) => {
  let shops = await callHistoryService.checkvisitOncallStatus(req.params.id);
  res.send(shops);
});

const updateStatuscallVisit = catchAsync(async (req, res) => {
  let userId = req.userId;
  let shops = await callHistoryService.updateStatuscallVisit(req.params.id, userId);
  res.send(shops);
});

const getshopsOrderWise = catchAsync(async (req, res) => {
  const shops = await callHistoryService.getshopsOrderWise(req.params.status);
  res.send(shops);
});

const getcallHistorylastFivedays = catchAsync(async (req, res) => {
  const callhistory = await callHistoryService.getcallHistorylastFivedays(req.params.id);
  res.send(callhistory);
});

const getacceptDeclined = catchAsync(async (req, res) => {
  const callhistories = await callHistoryService.getacceptDeclined();
  res.send(callhistories);
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
  callingStatusreport,
  updateOrderedStatus,
  getOncallfromshops,
  checkvisitOncallStatus,
  updateStatuscallVisit,
  getshopsOrderWise,
  getcallHistorylastFivedays,
  getacceptDeclined,
};
