const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');
const otpsave = mongoose.Schema({
  name: {
    type: String,
  },
  OTP: {
    type: Number,
  },
  mobileNumber: {
    type: Number,
  },
  date: {
    type: String,
    default: moment().utcOffset(331).format('DD-MM-yyy'),
  },
  time: {
    type: String,
    default: moment().utcOffset(331).format('h:mm a'),
  },
  expired: {
    type: Boolean,
  },
  userId: {
    type: String,
  },
  used: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  create: {
    type: String,
    default: moment().utcOffset(331).format(),
  },
});
otpsave.plugin(toJSON);
otpsave.plugin(paginate);
const OTP = mongoose.model('OTP', otpsave);
module.exports = OTP;
