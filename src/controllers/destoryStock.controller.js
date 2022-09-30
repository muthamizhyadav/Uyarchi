const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const destroyStockService = require('../services/destoryStock.service')



const getProductNAmeFromRandom = catchAsync(async (req, res) => {
    const cashAsGivenByWDE = await destroyStockService.getProductNAmeFromRandom();
    res.send(cashAsGivenByWDE);
});

module.exports = {
    getProductNAmeFromRandom,
}