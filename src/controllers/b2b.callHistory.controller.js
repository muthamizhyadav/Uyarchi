const callHistoryService = require('../services/b2b.callHistory.service');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');


const createCallHistory = catchAsync(async (req, res) => {
    const callHistory = await callHistoryService.createCallHistory(req.body)
    res.send(callHistory)
})

const getAll = catchAsync(async (req, res) => {
    const callhistory = await callHistoryService.getAll()
    res.send(callhistory)
})

const getShop = catchAsync(async (req, res) => {
    const shopId = await callHistoryService.getShop()
    res.send(shopId)
});


module.exports = {
    createCallHistory,
    getAll,
    getShop,
}