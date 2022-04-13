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
  stock:{
    type:Number
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
  _id:{
    type:String,
    default:v4
  },
  supplierId:{
    type:String,
  },
  supplierName:{
    type:String,
  },
  product:{
    type:Array,
  },
  productName:{
    type:String
  },
  totalPrice:{
    type:Number
  },
  logisticCost:{
    type:Number,
  },
  coolieCost:{
    type:Number,
  },
  misAllianceCost:{
    type:Number,
  },
  orderId:{
    type:String,
  },
})

stockSchema.plugin(toJSON);
stockSchema.plugin(paginate);

const Stock = mongoose.model('Stock', stockSchema)


module.exports = {
  Stock,
  Product,
}
