const httpStatus = require('http-status');
const Userfine = require('../models/user_Fine.model');
const ApiError = require('../utils/ApiError');
const {
    ShopOrderClone
} = require('../models/shopOrder.model')
const orderPayment = require('../models/orderpayment.model')
const moment = require('moment');

// create UserFine

const createUserFine = async (body) => {
    let values = {
        ...body, ...{
            created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HH:mm:ss')
        }
    }
    let orderId = body.orderId
    console.log(orderId)
    await orderPayment.findByIdAndUpdate({ _id: orderId }, { creditApprovalStatus: "Approved" }, { new: true })
    const createValues = await Userfine.create(values)
    return createValues
}




module.exports = {
    createUserFine
}