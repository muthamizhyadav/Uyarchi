const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const callStatusSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  qtyOffered: {
    type: Number,
  },
  strechedUpto: {
    type: Number,
  },
  price: {
    type: Number,
  },
  status: String,
  requestAdvancePayment: {
    type: String,
  },
  callstatus:{
    type:Object,
  },
  callDetail:{
    type:String,
  },
  productid: {
    type: String,
  },
  supplierid: {
    type: String,
  },
  confirmOrder:{
    type:String,
  },
  phStatus:{
    type:String,
  },
  phreason:{
    type:String,
  },
  phApproved:{
    type:Number,
  },
  date: {
    type: String,
  },
  time: {
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

callStatusSchema.plugin(toJSON);
callStatusSchema.plugin(paginate);

const CallStatus = mongoose.model('callStatus', callStatusSchema);

module.exports = CallStatus;
