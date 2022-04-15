const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const productSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  productTitle: {
    type: String,
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  unit: {
    type: Number,
  },
  tags: {
    type: String,
  },
  image: {
    type: String,
  },
  subscrption: {
    type: String,
    enum: ['yes', 'no'],
  },

  enquiry: {
    type: String,
    enum: ['yes', 'no'],
  },
  salePrice: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  purchasePrice: {
    type: Number,
  },
  shippingPrice: {
    type: Number,
  },
  productTax: {
    type: Number,
  },
  productDiscount: {
    type: Number,
  },
  needBidding: {
    type: String,
    enum: ['yes', 'no'],
  },
  biddingStartDate: {
    type: Date,
  },
  biddingStartTime: {
    type: String,
  },
  biddingEndDate: {
    type: Date,
  },
  biddingEndTime: {
    type: String,
  },
  maxBidAomunt: {
    type: Number,
  },
  minBidAmount: {
    type: Number,
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
productSchema.plugin(toJSON);
productSchema.plugin(paginate);
const Product = mongoose.model('Product', productSchema);

const stockSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  supplierId: {
    type: String,
  },
  supplierName: {
    type: String,
  },
  product: {
    type: Array,
  },
  productName: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  logisticCost: {
    type: Number,
  },
  coolieCost: {
    type: Number,
  },
  misAllianceCost: {
    type: Number,
  },
  orderId: {
    type: String,
  },
  arrived: {
    type: Boolean,
    default: false,
  },
});

stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);

const Stock = mongoose.model('Stock', stockSchema);

const confirmStock = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  stockId: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
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
confirmStock.plugin(toJSON);
confirmStock.plugin(paginate);

const ConfirmStock = mongoose.model('ConfirmStock', confirmStock);

const loadingExecuteSchema = new mongoose.Schema({
  _id: {
    type: String,
    default:v4
  },
  productId: {
    type: String,
  },
  quantity: {
    type: String,
  },
  wastage: {
    type: String,
  },
  netWeight: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Delivered', 'UnDelivered'],
    default: 'UnDelivered',
  },
  active:{
    type:Boolean,
    default:true
  },
  archive:{
    type:Boolean,
    default:false
  },
});
loadingExecuteSchema.plugin(toJSON);
loadingExecuteSchema.plugin(paginate);
const LoadingExecute = mongoose.model('MainWharehouseLoadingExecute', loadingExecuteSchema);

module.exports = {
  Stock,
  Product,
  ConfirmStock,
  LoadingExecute,
};
