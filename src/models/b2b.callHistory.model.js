const mongoose = require('mongoose');
const { v4 } = require('uuid');
const moment = require('moment');

const callHistorySchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  userId: {
    type: String,
  },
  TimeofCall: {
    type: String,
  },
  callStatus: {
    type: String,
  },
  orderedStatus: {
    type: String,
  },
  reason: {
    type: String,
  },
  calledBy: {
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
  shopId: {
    type: String,
  },
  date: {
    type: String,
    default: moment().format('DD-MM-yyy'),
  },
  time: {
    type: String,
    default: moment().format('h:mm a'),
  },
  status: {
    type: String,
    default: 'Pending',
  },
  noOfCalls: {
    type: Number,
    default: 0,
  },
  reason: {
    type: String,
  },
  // reSchedule:{
  //   type: String,
  // },
  // callBackReason: {
  //   type: String,
  // },

  select: {
    type: String,
  },
  selectStatus: {
    type: String,
  },
  type: {
    type: String,
  },
  // orderedStatus: {
  //   type: String,
  // },
});

const callHistory = mongoose.model('callHistory', callHistorySchema);

module.exports = callHistory;
