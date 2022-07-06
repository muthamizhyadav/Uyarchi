const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const supplierbillsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  groupId: {
    type: String,
  },
  pendingAmount: {
    type: Number,
  },
  Amount: {
    type: Number,
  },
  transactionId: {
    type: String,
  },
  date: {
    type: String,
    default: moment().utcOffset(328).format('DD-MM-yyy'),
  },
  time: {
    type: String,
    default: moment().utcOffset(328).format('h:mm a'),
  },
  PaymentMethod: {
    type: String,
  },
  status: {
    type: String,
    default: 'Paid',
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
});

const SupplierBills = mongoose.model('SupplierBills', supplierbillsSchema);
module.exports = SupplierBills;
