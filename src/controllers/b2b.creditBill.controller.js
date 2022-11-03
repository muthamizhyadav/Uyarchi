const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const creditBillService = require('../services/b2b.creditBill.service');


const getShopWithBill = catchAsync(async (req, res) => {
  const bill = await creditBillService.getShopWithBill(req.params.page);
  res.send(bill);
})

const getWardExecutiveName = catchAsync(async (req, res) => {
  const bill = await creditBillService.getWardExecutiveName();
  res.send(bill);
})

const getsalesmanName = catchAsync(async (req, res) => {
  const bill = await creditBillService.getsalesmanName();
  res.send(bill);
})

const getShopHistory = catchAsync(async (req, res) => {
  const bill = await creditBillService.getShopHistory(req.userId, req.params.page);
  res.send(bill);
})

const createGroupcredit = catchAsync(async (req, res) => {
  const shopOrderClone = await creditBillService.createGroup(req.body);
  res.send(shopOrderClone);
});

const payingCAshWithDEorSM = catchAsync(async (req, res) => {
  const bill = await creditBillService.payingCAshWithDEorSM(req.params.id, req.body);
  res.send(bill);
})

const getManageCreditBillAssigning = catchAsync(async (req, res) => {
  const name = await creditBillService.getManageCreditBillAssigning();
  res.send(name);
});

const getcreditBillDetailsByPassExecID = catchAsync(async (req, res) => {
  const data = await creditBillService.getcreditBillDetailsByPassExecID(req.params.id);
  res.send(data);
})

const updateAssigned = catchAsync(async (req, res) => {
  const approval = await creditBillService.updateAssignedStatusByMultiSelect(req.body);
  res.send(approval);
});

const getHistoryByPassOrderId = catchAsync(async (req, res) => {
  const approval = await creditBillService.getHistoryByPassOrderId(req.params.id);
  res.send(approval);
});

const getDElExecutiveName = catchAsync(async (req, res) => {
  const delName = await creditBillService.getDElExecutiveName();
  res.send(delName);
})
const getsalesName = catchAsync(async (req, res) => {
  const delName = await creditBillService.getsalesName();
  res.send(delName);
})
const getNotAssignData = catchAsync(async (req, res) => {
  const delName = await creditBillService.getNotAssignData(req.params.page);
  res.send(delName);
})

const getShopPendingByPassingShopId = catchAsync(async (req, res) => {
  const delName = await creditBillService.getShopPendingByPassingShopId(req.params.id);
  res.send(delName);
})

const getDeliDetails = catchAsync(async (req, res) => {
  const name = await creditBillService.getDeliDetails();
  res.send(name);
})

const getFineAccount = catchAsync(async (req, res) => {
  const name = await creditBillService.getFineAccount(req.params.id);
  res.send(name);
});

const getDeliveryExecutiveName = catchAsync(async (req, res) => {
  const name = await creditBillService.getDeliveryExecutiveName();
  res.send(name);
})
const getgetGroupAndBill = catchAsync(async (req, res) => {
  const name = await creditBillService.getDetailsByPassGroupId(req.params.id);
  res.send(name);
})

const GroupDetails = catchAsync(async (req, res) => {
  const name = await creditBillService.getGroupAndBill(req.params.id);
  res.send(name);
})

const submitDispute = catchAsync(async (req, res) => {
  const dispute = await creditBillService.submitDispute(req.params.id, req.body);
  console.log(req.params.id, req.body);
  res.send(dispute)
});

const getPaymentTypeCount = catchAsync(async (req, res) => {
  const getDta = await creditBillService.getPaymentTypeCount(req.params.id);
  res.send(getDta);
})

const getdeliveryExcutive = catchAsync(async (req, res) => {
  const getDta = await creditBillService.getdeliveryExcutive(req.userId,req.params.page);
  res.send(getDta);
})





module.exports = {

  getShopWithBill,
  getWardExecutiveName,
  getsalesmanName,
  getShopHistory,
  createGroupcredit,
  payingCAshWithDEorSM,
  getManageCreditBillAssigning,
  getcreditBillDetailsByPassExecID,
  updateAssigned,
  getHistoryByPassOrderId,
  getDElExecutiveName,
  getsalesName,
  getNotAssignData,
  getShopPendingByPassingShopId,
  getDeliDetails,
  getFineAccount,
  getDeliveryExecutiveName,
  getgetGroupAndBill,
  GroupDetails,
  submitDispute,
  getPaymentTypeCount,
  getdeliveryExcutive
}