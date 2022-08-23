const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const wardAdminGroupSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  groupId: {
    type: String,
  },
  assignDate: {
    type: String,
  },
  assignTime: {
    type: String,
  },
  Orderdatas:{
    type: Array,
    default: [],
  },
  pettyStockData: {
    type: Array,
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },

  archive: {
    type: Boolean,
    default: false,
  },
  deliveryExecutiveId: {
    type: String,
  },

  totalOrders: {
    type: Number,
  },
  status: {
    type: String,
    default: "Assigned",
  },
  manageDeliveryStatus:{
    type:String,
    default:"Pending",
  },
  pettyCashAllocateStatus: {
    type: String,
    default: "Pending",
  },
  pettyStockAllocateStatus: {
    type: String,
    default: "Pending",
  },
  
  AllocateStatus: {
    type: String,
    default: "Assigned",
  },
  // NotAllocateStatus: {
  //   type: String,
  //   default: "Pending",
  // },
  pettyCash: {
    type: Number,
  },
  pettyStock: {
    type: Array,
    default: [],
  },
  totalQtyIncludingPettyStock: {
    type: Number,
  },
  receiveStatus: {
    type: String,
    default: "Pending"
  },
  pettyCashReceiveStatus: {
    type: String,
    default: "Pending",
  },
  stockReturnedByWDE: {
    type: Number,
  },
  wastageReturnedByWDE: {
    type: Number,
  },
  wastageImageUpload: {
    type: String,
  },
  mismatch: {
    type: Number,
  },
  DeliverAsPerSystem: {
    type: Number,
  },
  UnDeliveredAsPerSystem: {
    type: Number,
  },

});

const wardAdminGroupModel = mongoose.model('wardAdminGroup', wardAdminGroupSchema);

module.exports = wardAdminGroupModel;
