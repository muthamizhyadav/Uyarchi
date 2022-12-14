const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');
let date = moment().format('YYYY-MM-DD');
const shopEnrollmentEnquirySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  date: {
    type: String,
    default:moment().format('YYYY-MM-DD'),
  },
  time: {
    type: String,
    default:moment().format('h:mm a'),
  },
  shopType: {
    type: String,
  },
  shopName: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  area: {
    type: String,
  },
  contactName:{
    type:String,
  },
  pincode:{
    type:Number,
  },
  status:{
    type:String,
  },
  uid:{
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
},
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  }
  );

const ShopEnrollmentEnquiry = mongoose.model('enrollmentEnquiryShop', shopEnrollmentEnquirySchema);

module.exports = {ShopEnrollmentEnquiry};