const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { SupplierUnbilled, SupplierUnbilledHistory } = require('../models/supplier.Unbilled.model')
const moment = require('moment');

const createSupplierUnBilled = async (body) => {
    const { supplierId, un_Billed_amt } = body
    const sunbilled = await SupplierUnbilled.findOne({ supplierId: supplierId })
    if (!sunbilled) {
        let values = await SupplierUnbilled.create({ ...body, ...{ date: moment().format("YYYY-MM-DD"), created: moment() } })
        await SupplierUnbilledHistory.create({ ...body, ...{ date: moment().format("YYYY-MM-DD"), created: moment(), un_BilledId: values._id } })
        return values
    } else {
        let unBamt = parseInt(un_Billed_amt)
        let existamt = parseInt(sunbilled.un_Billed_amt)
        let total = unBamt + existamt
        let value = await SupplierUnbilled.findByIdAndUpdate({ _id: sunbilled._id }, { un_Billed_amt: total }, { new: true })
        await SupplierUnbilledHistory.create({ ...body, ...{ date: moment().format("YYYY-MM-DD"), created: moment(), un_BilledId: value._id } })
        return value
    }
}

module.exports = {
    createSupplierUnBilled,
}