const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const usableStockSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  FQ1: {
    type: Number,
  },
  FQ2: {
    type: Number,
  },
  FQ3: {
    type: Number,
  },
  productId: {
    type: String,
  },
  wastage: {
    type: Number,
  },
  status: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  totalStock: {
    type: Number,
  },
  closingStock: {
    type: Number,
  },
  oldStock: { type: Number },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
});

const usableStock = mongoose.model('usableStock', usableStockSchema);

const usableStockhistory = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  FQ1: {
    type: Number,
  },
  FQ2: {
    type: Number,
  },
  FQ3: {
    type: Number,
  },

  wastage: {
    type: Number,
  },
  status: {
    type: String,
  },
  date: {
    type: String,
    default: moment().utcOffset(330).format('DD-MM-yyy'),
  },
  time: {
    type: String,
    default: moment().utcOffset(330).format('h:mm a'),
  },
  timeFilter: {
    type: String,
    default: moment().utcOffset(330).format('Hmm'),
  },
  usableStock:{
    type:String
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

const Stockhistory = mongoose.model('usableStockhistory', usableStockhistory);

module.exports = { usableStock, Stockhistory };
