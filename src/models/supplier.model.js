const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const supplierSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  tradeName: {
    type: String,
  },
  companytype: {
    type: String,
    enum: ['Proprietorship', 'LLP', 'Partnership', 'Private Limited', 'Public Limited', 'Others', 'Individual'],
  },
  primaryContactNumber: {
    type: String,
  },
  primaryContactName: {
    type: String,
  },
  secondaryContactName: {
    type: String,
  },
  secondaryContactNumber: {
    type: String,
  },
  RegisteredAddress: {
    type: String,
  },
  countries: {
    type: String,
  },
  state: {
    type: String,
  },
  district: {
    type: String,
  },
  gpsLocat: {
    type: String,
  },
  gstNo: {
    type: String,
  },
  email: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  productDealingWith: {
    type: Array,
  },
  createdByStatus:{
    type:String
  },
  approvedStatus:{
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

supplierSchema.plugin(toJSON);
supplierSchema.plugin(paginate);
const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
