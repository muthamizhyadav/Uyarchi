const mongoose = require('mongoose');
const { v4 } = require('uuid');
const moment = require('moment');

const walletPaymentSchema = mongoose.Schema({
    _id: {
        type: String,
    },
    currentAmount: {
        type: Number,
    },
    walletAmountAdded: {
        type: Number,
    },
    paymentMode: {
        type: String,
    },
    date: {
        type: String,
        default: moment().utcOffset(331).format('DD-MM-yyy'),
      },
      time: {
        type: String,
        default: moment().utcOffset(331).format('h:mm a'),
      },
});

const walletPayment = mongoose.model('walletPayment', walletSchema);

module.exports = walletPayment;
