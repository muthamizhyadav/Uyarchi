const httpStatus = require('http-status');
const Userfine = require('../models/user_Fine.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

// create UserFine

const createUserFine = async (body) => {
    let values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HH:mm:ss')
}}
const createValues = await Userfine.create(values)
return createValues
}




module.exports = {
    createUserFine
}