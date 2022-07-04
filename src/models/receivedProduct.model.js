const mongoose = require('mongoose');
const { v4, stringify } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const receivedProducrSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  callstatus: {
    type: Array,
  },
  date: {
    type: String,
  },
  driverName: {
    type: String,
  },
  driverNumber: {
    type: String,
  },
  status: {
    type: String,
    default: 'Acknowledged',
  },
  supplierId: {
    type: String,
  },
  time: {
    type: String,
  },
  vehicleNumber: {
    type: String,
  },
  vehicleType: {
    type: String,
  },
  weighBridgeEmpty: {
    type: String,
  },
  weighBridgeLoadedProduct: {
    type: String,
  },
  billingQuantity: {
    type: Number,
  },
  billingPrice: {
    type: Number,
  },
  BillNo: {
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

const ReceivedProduct = mongoose.model('ReceivedProduct', receivedProducrSchema);

module.exports = ReceivedProduct;
