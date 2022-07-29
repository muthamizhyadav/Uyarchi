const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

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

module.exports = usableStock;
