const mongoose = require('mongoose');
const { v4 } = require('uuid');
const moment = require('moment');

const attendancePayment = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  type: {
    type: String,
  },
  GpayNo: {
    type: Number,
  },
  payAmount: {
    type: Number,
  },
  payType: {
    type: String,
  },
  date: {
    type: String,
    default: moment().utcOffset(330).format('DD-MM-yyy'),
  },
  time: {
    type: String,
    default: moment().utcOffset(330).format('h:mm a'),
  },
});

const paymentAttendance = mongoose.model('attendancePayment', attendancePayment);

module.exports = paymentAttendance;
