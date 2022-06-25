const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const b2busersalaryController = require('../services/b2buser.salaryInfo.service');



const createB2bSalaryInfo = catchAsync(async (req, res) => {
    const salaryInfo = await b2busersalaryController.createB2bSalaryInfo(req.body)
    res.send(salaryInfo)
})


module.exports = {
    createB2bSalaryInfo
}