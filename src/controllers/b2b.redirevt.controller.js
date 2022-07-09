const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const reNameService = require('../services/sample.service')

const createReName = catchAsync(async (req, res) => {
    const rename = await reNameService.createReName(req.params);
    res.send(rename)
});

module.exports = {
    createReName,
}
