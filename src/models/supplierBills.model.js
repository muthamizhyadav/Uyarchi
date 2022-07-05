const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

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
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  PaymentMethod: {
    type: String,
  },
  status: {
    type: String,
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
