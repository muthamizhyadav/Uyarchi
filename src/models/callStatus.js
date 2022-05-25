const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const callStatus = mongoose.Schema({
  _id:false,
  accepted:String,
  declined:Object,
  callBack:Object,
})

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
  callstatus:callStatus,
  productid:{
    type:String,
  },
  noStock:String,
  pendingBills:String,
  pastBitter:String,
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
