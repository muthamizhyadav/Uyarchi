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
  Orderdatas: {
    type: Array,
    default: [],
  },
  // pettyStockData: {
  //   type: Array,
  //   default: [],
  // },
  active: {
    type: Boolean,
    default: true,
  },
  vehicleId: {
    type: String,
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
    default: 'Assigned',
  },
  manageDeliveryStatus: {
    type: String,
    default: 'Pending',
  },
  pettyCashAllocateStatus: {
    type: String,
    default: 'Pending',
  },
  pettyStockAllocateStatus: {
    type: String,
    default: 'Pending',
  },
  pettyStockAllocateStatusNumber: {
    type: Number,
  },

  AllocateStatus: {
    type: String,
    default: 'Assigned',
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
  cashAsGivenByWDE: {
    type: Number,
  },
  shopOrderCloneID: {
    type: String,
  },
  route: {
    type: String,
  },
  GroupBillId: {
    type: String,
  },
  GroupBillDate: {
    type: String,
  },
  GroupBillTime: {
    type: String,
  },
  ByCashIncPettyCash: {
    type: Number,
  },
  Disputestatus: {
    type: String,
  },
  mismatchStockStatus: {
    type: String,
  },
  FinishingStatus: {
    type: String,
    default: "Pending"
  }
});

const wardAdminGroup = mongoose.model('wardAdminGroup', wardAdminGroupSchema);

const wardAdminGroupSchema_ORDER = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  orderId: {
    type: String,
  },
  wardAdminGroupID: {
    type: String,
  },
  status: {
    type: String,
    default: 'Assigned',
  },
  vehicleId: {
    type: String,
  },
  created: {
    type: Date,
  },
  date: {
    type: String,
    default: moment().utcOffset(330).format('DD-MM-yyy'),
  },
  time: {
    type: String,
    default: moment().utcOffset(330).format('h:mm a'),
  },
  AssignedstatusPerDay: {
    type: String,
  },
});

const wardAdminGroupModel_ORDERS = mongoose.model('orderAssign', wardAdminGroupSchema_ORDER);
const wardAdminGroupfineSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  groupId: {
    type: String,
  },
  deliveryExecutiveId: {
    type: String,
  },
  status: {
    type: String,
  },
  productId: {
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
});

const WardAdminGroupfine = mongoose.model('wardAdminGroupfine', wardAdminGroupfineSchema);
module.exports = { wardAdminGroup, wardAdminGroupModel_ORDERS, WardAdminGroupfine };
