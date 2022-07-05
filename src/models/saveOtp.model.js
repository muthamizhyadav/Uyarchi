const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');
let options = {
    timeZone: 'asia/kolkata',
    hour: 'numeric',
    minute: 'numeric',
  },
  formatter = new Intl.DateTimeFormat([], options);
var dt = moment(formatter.format(new Date()), ['h:mm A']).format('h:mm a');
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
    default: moment(new Date()).format('DD-MM-yyy'),
  },
  time: {
    type: String,
    default: dt,
  },
  expired: {
    type: Boolean,
  },
  userId: {
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
  create: {
    type: String,
    default: moment().utcOffset('+05:30').format()
  },
});
otpsave.plugin(toJSON);
otpsave.plugin(paginate);
const OTP = mongoose.model('OTP', otpsave);
module.exports = OTP;
