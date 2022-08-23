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
  let call;
  if (req.params.status == 'Pending') {
    call = await callHistoryService.getShop_pending(
      req.params.date,
      req.params.status,
      req.params.key,
      req.params.page,
      userId,
      userRole
    );
  } else if (req.params.status == 'callback' ||req.params.status == 'accept' ||req.params.status == 'declined') {
    call = await callHistoryService.getShop_callback(
      req.params.date,
      req.params.status,
      req.params.key,
      req.params.page,
      userId,
      userRole
    );
  }
  else if (req.params.status == 'reschedule') {
    call = await callHistoryService.getShop_reshedule(
      req.params.date,
      req.params.status,
      req.params.key,
      req.params.page,
      userId,
      userRole
    );
  }
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

// date, status, page, userId, userRole

const getacceptDeclined = catchAsync(async (req, res) => {
  let userId = req.userId;
  let userRole = req.userRole;
  const callhistories = await callHistoryService.getacceptDeclined(
    req.params.status,
    req.params.date,
    req.params.key,
    req.params.page,
    userId,
    userRole
  );
  res.send(callhistories);
});

const resethistory = catchAsync(async (req, res) => {
  const callhistories = await callHistoryService.resethistory();
  res.send(callhistories);
});

const previouscallBackAnd_Reshedule = catchAsync(async (req, res) => {
  const shops = await callHistoryService.previouscallBackAnd_Reshedule();
  res.send(shops);
});
const getOncallShops = catchAsync(async (req, res) => {
  const shops = await callHistoryService.getOncallShops();
  res.send(shops);
});

const oncallstatusByUser = catchAsync(async (req, res) => {
  let userId = req.userId;
  const shops = await callHistoryService.oncallstatusByUser(userId);
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
  callingStatusreport,
  updateOrderedStatus,
  getOncallfromshops,
  checkvisitOncallStatus,
  updateStatuscallVisit,
  getshopsOrderWise,
  getcallHistorylastFivedays,
  getacceptDeclined,
  resethistory,
  previouscallBackAnd_Reshedule,
  getOncallShops,
  oncallstatusByUser,
};
