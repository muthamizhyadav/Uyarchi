const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const supplierUnBilledService = require('../services/supplier.unBilled.service');

const createSupplierUnBilled = catchAsync(async (req, res) => {
    let data = await supplierUnBilledService.createSupplierUnBilled(req.body);
    res.send(data)
})

const getUnBilledBySupplier = catchAsync(async (req, res) => {
    let data = await supplierUnBilledService.getUnBilledBySupplier()
    res.send(data)
})

const getSupplierAdvance = catchAsync(async (req, res) => {
    const data = await supplierUnBilledService.getSupplierAdvance(req.params.supplierId)
    res.send(data)
})

const getSupplierOrdered_Details = catchAsync(async (req, res) => {
    const data = await supplierUnBilledService.getSupplierOrdered_Details(req.params.id)
    res.send(data)
})

module.exports = {
    createSupplierUnBilled,
    getUnBilledBySupplier,
    getSupplierAdvance,
    getSupplierOrdered_Details,
}