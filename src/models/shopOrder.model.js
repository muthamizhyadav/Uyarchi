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
  status: {
    type: String,
    default: 'ordered'
  },
  productStatus: {
    type: String,
    default: 'pending',
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

productorderCloneSchema.plugin(toJSON);
productorderCloneSchema.plugin(paginate);
const ProductorderClone = mongoose.model('ProductOrderClone', productorderCloneSchema);

module.exports = { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone };
