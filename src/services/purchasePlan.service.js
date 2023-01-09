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
        let plan=await Streamplan.findById(req.body.plan);
        if (collectedstatus == 'captured' && collectedAmount ==plan.salesPrice ) {
           let con= await purchasePlan.create({...{planId:req.body.plan,suppierId:req.userId,paidAmount:collectedAmount,paymentStatus:collectedstatus,order_id:payment.order_id},...req.body.PaymentDatails});
           await Date.create_date(con)
          return con;
        }
        else{
            return {error:"Amount Not Match"}
        }
    }
    else{
        return {error:"order not found"}
    }

}


module.exports = {
    create_purchase_plan
}