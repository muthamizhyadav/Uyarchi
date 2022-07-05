const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const attendanceModel = require("../models/b2bAttendance.model");

const createAttendance = async (attendanceBody) => {
    const { month, ApprovedAbsentDays } = attendanceBody
    let total = month - ApprovedAbsentDays;
    let values = { ...attendanceBody, ...{ TotalWorkingDays: total } }
    let attendance = await attendanceModel.create(values)
    return attendance;
}

const getAll = async () => {
    return attendanceModel.find()
}


module.exports = {
    createAttendance,
    getAll
}