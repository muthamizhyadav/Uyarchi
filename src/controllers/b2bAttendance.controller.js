const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const attendanceService = require("../services/b2bAttendance.service");
const httpStatus = require('http-status');

const createAttendance = catchAsync(async (req, res) => {
    const attendance = await attendanceService.createAttendance(req.body);
    res.send(attendance);
});


const getAll = catchAsync(async (req, res) => {
    const attendance = await attendanceService.getAll(req.params.page)
    res.send(attendance)
});

module.exports = {
    createAttendance,
    getAll
}

