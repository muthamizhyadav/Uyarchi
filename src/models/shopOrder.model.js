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
  Uid:{
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

ShopOrderPriceSchema.plugin(toJSON);
ShopOrderPriceSchema.plugin(paginate);
const ShopOrder = mongoose.model('ShopOrder', ShopOrderPriceSchema);


const productorderSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  productid:{
    type:String
  },
  quantity:{
    type:Number,
  },
  priceperkg:{
    type:Number
  },
  orderId:{
    type:String,
  },
  customerId:{
    type:String,
  },
  date:{
    type:String,
  },
  time:{
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

productorderSchema.plugin(toJSON);
productorderSchema.plugin(paginate);
const ProductorderSchema = mongoose.model('ProductOrder', productorderSchema);


module.exports = {ShopOrder, ProductorderSchema};
