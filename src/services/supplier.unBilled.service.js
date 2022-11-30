const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { SupplierUnbilled, SupplierUnbilledHistory } = require('../models/supplier.Unbilled.model')
const moment = require('moment');
const CallStatus = require('../models/callStatus')
const Supplier = require('../models/supplier.model')

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
        let value = await SupplierUnbilled.findByIdAndUpdate({ _id: sunbilled._id }, { un_Billed_amt: total, date: moment().format("YYYY-MM-DD"), created: moment() }, { new: true })
        await SupplierUnbilledHistory.create({ ...body, ...{ date: moment().format("YYYY-MM-DD"), created: moment(), un_BilledId: value._id } })
        return value
    }
}


const getUnBilledBySupplier = async () => {
    let values = await SupplierUnbilled.aggregate([
        {
            $lookup: {
                from: 'suppliers',
                localField: 'supplierId',
                foreignField: '_id',
                pipeline: [{
                    $lookup: {
                        from: 'callstatuses',
                        localField: '_id',
                        foreignField: 'supplierid',
                        pipeline: [{ $match: { status: 'Advance' } }, { $group: { _id: null, TotalAdvance: { $sum: '$TotalAmount' } } }],
                        as: 'suppplierOrders',
                    },
                },
                {
                    $unwind: {
                        preserveNullAndEmptyArrays: true,
                        path: '$suppplierOrders'
                    }
                }],
                as: 'suppliers',
            },
        },
        {
            $unwind: {
                preserveNullAndEmptyArrays: true,
                path: '$suppliers'
            }
        },
        {
            $lookup: {
                from: 'supplierunbilledhistories',
                localField: 'supplierId',
                foreignField: 'supplierId',
                pipeline: [{
                    $group: { _id: null, TotalUnbilled: { $sum: '$un_Billed_amt' } }
                }],
                as: 'unBilledHistory',
            },
        },
        {
            $unwind: {
                preserveNullAndEmptyArrays: true,
                path: '$unBilledHistory'
            }
        },
        {
            $project: {
                _id: 1,
                un_Billed_amt: 1,
                date: 1,
                supplierName: '$suppliers.primaryContactName',
                Advance_raised: { $ifNull: ['$suppliers.suppplierOrders.TotalAdvance', 0] },
                total_UnbilledAmt: "$unBilledHistory.TotalUnbilled",
                supplierId: '$suppliers._id',
            }
        }
    ])
    return values
}

const getSupplierAdvance = async (supplierId) => {
    let values = await CallStatus.aggregate([
        {
            $match: { supplierid: supplierId, status: 'Advance' }
        },
        {
            $group: { _id: null, totalAdvance: { $sum: '$TotalAmount' } }
        }
    ])
    return values
}

const getSupplierOrdered_Details = async (id) => {
    let values = await CallStatus.aggregate([
        {
            $match: { supplierid: id }
        },
        {
            $project: {
                _id: 1,
                totalAmounts: { $ifNull: [{ $multiply: ['$confirmOrder', '$confirmprice'] }, 0] },
                date: 1,
                status: 1,
                date: 1,
                AdvanceRaised: { $ifNull: ['$TotalAmount', 0] },
                orderId: { $ifNull: ['$OrderId', 'oldData'] }
            }
        }
    ])
    return values
}

module.exports = {
    createSupplierUnBilled,
    getUnBilledBySupplier,
    getSupplierAdvance,
    getSupplierOrdered_Details,
}