const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const callStatusSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  qtyOffered: {
    type: String,
  },
  strechedUpto: {
    type: String,
  },
  price: {
    type: Number,
  },
  status: {
    type: String,
  },
  requestAdvancePayment: {
    type: String,
  },
  productid:{
    type:String,
  },
  supplierid:{
    type:String,
  },
  date:{
    type:String,
  },
  time:{
    type:String,
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
