const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { purchasePlan } = require('../models/purchasePlan.model');
const paymentgatway = require('./paymentgatway.service');
const Date = require('./Date.serive')

const { Streamplan } = require('../models/ecomplan.model');

const create_purchase_plan = async (req) => {
    let orders;
    if (req.body.PaymentDatails != null) {
        let payment = await paymentgatway.verifyRazorpay_Amount(req.body.PaymentDatails);
        console.log(payment)
        let collectedAmount = payment.amount / 100
        let collectedstatus = payment.status;
        let plan = await Streamplan.findById(req.body.plan);
        if (collectedstatus == 'captured' && collectedAmount == plan.salesPrice) {
            let con = await purchasePlan.create({ ...{ planId: req.body.plan, suppierId: req.userId, paidAmount: collectedAmount, paymentStatus: collectedstatus, order_id: payment.order_id }, ...req.body.PaymentDatails });
            await Date.create_date(con)
            return con;
        }
        else {
            return { error: "Amount Not Match" }
        }
    }
    else {
        return { error: "order not found" }
    }


}

const get_order_details = async (req) => {
    let order = await purchasePlan.findById(req.query.id);
    if (!order || order.suppierId != req.userId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
    }
    let plan = await Streamplan.findById(order.planId);
    let payment = await paymentgatway.verifyRazorpay_Amount({ razorpay_order_id: order.razorpay_order_id, razorpay_payment_id: order.razorpay_payment_id, razorpay_signature: order.razorpay_signature });

    return { payment, plan, order }
}

const get_all_my_orders = async (req) => {
    let plan = await purchasePlan.aggregate([
        { $match: { suppierId: req.userId } },
        {
            $lookup: {
                from: 'streamplans',
                localField: 'planId',
                foreignField: '_id',
                as: 'streamplans',
            },
        },
        {
            $unwind: {
                path: '$streamplans',
                preserveNullAndEmptyArrays: true,
            },
        },
    ])

    return plan;
}

module.exports = {
    create_purchase_plan,
    get_order_details,
    get_all_my_orders
}