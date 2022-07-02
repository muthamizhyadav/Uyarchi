const mongoose = require('mongoose');
const { v4, stringify } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const receivedStockSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  callstatusId: {
    type: String,
  },
  groupId: {
    type: String,
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
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: String,
  },
  supplierId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  incomingQuantity: {
    type: Number,
  },
  incomingWastage: {
    type: Number,
  },
});

const ReceivedStock = mongoose.model('receivedStock', receivedStockSchema);

module.exports = ReceivedStock;
