const httpStatus = require('http-status');
const { Streamplan } = require('../models/ecomplan.model');
const ApiError = require('../utils/ApiError');

const Date=require('./Date.serive')

const create_Plans = async (req) => {
    console.log(req.body)
    const value=await Streamplan.create(req.body)
    await Date.create_date(value)
    console.log(value);
    return value;
};


module.exports = {
    create_Plans,
};
