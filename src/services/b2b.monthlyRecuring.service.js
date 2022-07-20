const httpStatus = require('http-status');
const monthlyRecuringModel = require('../models/b2b.monthlyRecuring.model');
const ApiError = require('../utils/ApiError');


const createMonthlyRecuring = async (body) => {
    let recuring = await monthlyRecuringModel.create(body)
    return recuring;
}

const getAll = async () => {
    return monthlyRecuringModel.find();
  };



module.exports= {
    createMonthlyRecuring,
    getAll,

}
