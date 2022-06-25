const httpStatus = require('http-status');
const B2bUserSalaryInfo = require('../models/b2buserSalaryInfo.model')
const ApiError = require('../utils/ApiError');


const createB2bSalaryInfo = async (body) => {
    const salaryInfo = await B2bUserSalaryInfo.create(body)
    return salaryInfo
}

module.exports = {
    createB2bSalaryInfo
}