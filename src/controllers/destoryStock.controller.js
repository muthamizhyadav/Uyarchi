const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const destroyStockService = require('../services/destoryStock.service')



const getProductNAmeFromRandom = catchAsync(async (req, res) => {
    const cashAsGivenByWDE = await destroyStockService.getProductNAmeFromRandom();
    res.send(cashAsGivenByWDE);
});

const createDestroyStock = catchAsync(async (req, res) => {
    const sample = await destroyStockService.createDestroyStock(req.body);
    res.send(sample);
});

const getdetailsWithSorting = catchAsync(async (req, res) => {
    const data = await destroyStockService.getdetailsWithSorting(
        req.params.productId, 
        req.params.date
        );
    res.send(data);
})

const updateProduct = catchAsync(async (req, res) => {
    const product = await destroyStockService.updateProduct(req.params.product, req.body);
    res.send(product);
  });

module.exports = {
    getProductNAmeFromRandom,
    createDestroyStock,
    getdetailsWithSorting,
    updateProduct,
}