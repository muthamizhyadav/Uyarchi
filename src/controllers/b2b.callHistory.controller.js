const callHistoryService = require('../services/b2b.callHistory.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');


const createCallHistory = catchAsync(async (req, res) => {
    const callHistory = await callHistoryService.createCallHistory(req.body)
    res.send(callHistory)
});

const createstatus = catchAsync(async (req, res) => {
    const status = await callHistoryService.createStatus(req.body)
    res.send(status);
});

const getAll = catchAsync(async (req, res) => {
    const callhistory = await callHistoryService.getAll()
    res.send(callhistory)
})

const getShop = catchAsync(async (req, res) => {
    const shopId = await callHistoryService.getShop()
    res.send(shopId)
});


const getAllPage = catchAsync(async (req, res) => {
    const call = await callHistoryService.getShop(req.params.page)
    res.send(call)
});


module.exports = {
    createCallHistory,
    getAll,
    getShop,
    getAllPage,
    createstatus,
}