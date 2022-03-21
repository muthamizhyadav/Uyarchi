const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const d1 = new Date();
// console.log(d1);

// converting to number
const result = d1.getTime();
// console.log(result);
const sloggerSchema = mongoose.Schema({
  _id: {
    type: Number,
    default:v4,
  },
  customerType: {
    type: String,
    enum: ['admin', 'seller'],
  },
  productName: {
    type: String,
  },
  category: {
    type: Array,
    default: [],
  },
  subCategory: {
    type: Array,
    default: [],
  },
  rate: {
    type: Number,
  },
  unit: {
    type: Number,
  },
  measureMent: {
    type: String,
    enum: ['Kg', 'Grams'],
  },
  amount: {
    type: Number,
  },
  shopName: {
    type: String,
  },
  Area: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  zone: {
    type: String,
  },
  ward: {
    type: Number,
  },
  street: {
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

sloggerSchema.plugin(toJSON);
sloggerSchema.plugin(paginate);
const Slogger = mongoose.model('Slogger', sloggerSchema);

module.exports = Slogger;
