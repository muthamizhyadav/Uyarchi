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
  confirmprice: {
    type: Number,
  },
  status: String,
  requestAdvancePayment: {
    type: String,
  },
  callstatus: {
    type: String,
  },
  confirmcallstatus: {
    type: String,
  },
  callDetail: {
    type: String,
  },
  confirmcallDetail: {
    type: String,
  },
  productid: {
    type: String,
  },
  supplierid: {
    type: String,
  },
  confirmOrder: {
    type: Number,
  },
  phStatus: {
    type: String,
  },
  phreason: {
    type: String,
  },
  phApproved: {
    type: Number,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  stockStatus: {
    type: String,
    default:'Pending'
  },
  modified:{
    type:Boolean,
    default:false,
  },
  driverNumber:{
    type:Number,
  },
  weighBridgeEmpty:{
    type:String,
  },
  weighBridgeLoadedProduct:{
    type:String,
  },
  vehicleType: {
    type: String,
    default: '',
  },
  vehicleNumber: {
    type: String,
    default: '',
  },
  incomingQuantity:{
    type:Number,
  },
  incomingWastage:{
    type:Number,
  },
  driverName: {
    type: String,
    default: '',
  },
  weighbridgeBill: {
    type: String,
    default: '',
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
