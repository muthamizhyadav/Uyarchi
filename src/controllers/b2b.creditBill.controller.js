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
    const bill = await creditBillService.getShopHistory(req.params.id);
    res.send(bill);
})

const updateAssignedStatusPerBill = catchAsync(async (req, res) => {
    const bill = await creditBillService.updateAssignedStatusPerBill(req.params.id);
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

const  getcreditBillDetailsByPassExecID= catchAsync(async (req, res) => {
    const data = await creditBillService.getcreditBillDetailsByPassExecID(req.params.id);
    res.send(data);
})


module.exports = {

    getShopWithBill,
    getWardExecutiveName,
    getsalesmanName,
    getShopHistory,
    updateAssignedStatusPerBill,
    createGroupcredit,
    payingCAshWithDEorSM,
    getManageCreditBillAssigning,
    getcreditBillDetailsByPassExecID,
}