const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const ShopOrderPriceSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  shopId: {
    type: String,
    default: '',
  },
  product: {
    type: Array,
    default: [],
  },
  total: {
    type: Number,
  },
  paymentValue: {
    type: Number,
  },
  oldBalance: {
    type: Number,
  },
  status: {
    type: String,
  },
  Uid: {
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

ShopOrderPriceSchema.plugin(toJSON);
ShopOrderPriceSchema.plugin(paginate);
const ShopOrder = mongoose.model('ShopOrder', ShopOrderPriceSchema);

const ShopOrderClonePriceSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  shopId: {
    type: String,
    default: '',
  },
  product: {
    type: Array,
    default: [],
  },
  total: {
    type: Number,
  },
  paymentValue: {
    type: Number,
  },
  oldBalance: {
    type: Number,
  },
  paymentmode: {
    type: String,
  },
  subtotal: {
    type: Number,
  },
  GST: {
    type: Array,
  },
  SGST: {
    type: Number,
  },
  created: {
    type: Date,
  },
  CGST: {
    type: Number,
  },
  paidamount: {
    type: Number,
  },
  gsttotal: {
    type: Number,
  },
  delivery_type: {
    type: String,
  },
  time_of_delivery: {
    type: String,
  },
  status: {
    type: String,
    default: 'ordered',
  },
  productStatus: {
    type: String,
    default: 'pending',
  },
  overallTotal: {
    type: Number,
  },
  Uid: {
    type: String,
  },
  OrderId: {
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
  orderType: {
    type: String,
  },
  paymentStatus: {
    type: String,
  },
  devevery_mode: {
    type: String,
  },
  Payment: {
    type: String,
  },
  selfPickup: {
    type: String,
  },

  deliveryExecutiveId: {
    type: String,
  },
  reason: {
    type: String,
  },
  payType: {
    type: String,
  },
  billNo: {
    type: String,
  },
  billTime: {
    type: String,
  },
  billDate: {
    type: String,
  },
  customerDeliveryStatus: {
    type: String,
    default: 'Pending',
  },
  GroupId: {
    type: String,
  },
  receiveStatus: {
    type: String,
    default: 'Pending',
  },
  pettyCashReceiveStatus: {
    type: String,
    default: 'Pending',
  },

  AssignedStatus: {
    type: String,
    default: 'Pending',
  },
  completeStatus: {
    type: String,
    default: 'Pending',
  },
  WA_assigned_Time: {
    type: Date,
  },
  WL_Packed_Time: {
    type: Date,
  },
  finalProductTotal: {
    type: String,
  },
  reason: {
    type: String,
  },
  rbRefund: {
    type: String,
  },
  RedeliveredDate: {
    type: String,
  },
  RedeliveredTime: {
    type: String,
  },
  UnDeliveredStatus: {
    type: String,
    default: 'Pending',
  },
  statusUpdate: {
    type: Date,
  },
  lapsedOrder: {
    type: Boolean,
    default: false,
  },
});

ShopOrderClonePriceSchema.plugin(toJSON);
ShopOrderClonePriceSchema.plugin(paginate);
const ShopOrderClone = mongoose.model('ShopOrderClone', ShopOrderClonePriceSchema);

const productorderSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  productid: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  priceperkg: {
    type: Number,
  },
  orderId: {
    type: String,
  },
  customerId: {
    type: String,
  },
  modifyquantity: {
    type: Number,
  },
  modifypriceperkg: {
    type: Number,
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

productorderSchema.plugin(toJSON);
productorderSchema.plugin(paginate);
const ProductorderSchema = mongoose.model('ProductOrder', productorderSchema);

const productorderCloneSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  productid: {
    type: String,
  },
  preOrderClose: {
    type: Boolean,
    default: false,
  },
  GST_Number: {
    type: Number,
  },
  HSN_Code: {
    type: String,
  },
  packtypeId: {
    type: String,
  },
  unit: {
    type: String,
  },
  packKg: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  priceperkg: {
    type: Number,
  },
  orderId: {
    type: String,
  },
  OrderId: {
    type: String,
  },
  customerId: {
    type: String,
  },
  modifyquantity: {
    type: Number,
  },
  modifypriceperkg: {
    type: Number,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  productpacktypeId: {
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
  created: {
    type: Date,
  },
  status: {
    type: String,
    default: 'ordered',
  },
  finalQuantity: {
    type: Number,
  },
  finalPricePerKg: {
    type: Number,
  },
});

productorderCloneSchema.plugin(toJSON);
productorderCloneSchema.plugin(paginate);
const ProductorderClone = mongoose.model('ProductOrderClone', productorderCloneSchema);

module.exports = { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone };
