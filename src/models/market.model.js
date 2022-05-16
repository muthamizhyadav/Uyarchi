const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const marketSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  MName: {
    type: String,
  },
  locality: {
    type: String,
  },
  Address1: {
    type: String,
  },
  Address2: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  LandMark: {
    type: String,
  },
  image: {
    type: String,
  },
  mlongitude: {
    type: String,
  },
  mlatitude: {
    type: String,
  },
  Uid:{
    type:String,
  },
  userName:{
    type:String,
  },
  userNo:{
    type:Number,
  },
  status:{
    type:String,
  },
  created: {
    type:Date,
    default: Date.now
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
const Market = mongoose.model('market', marketSchema);
const ShopsSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  MName:{
    type: String,
  },
  SName: {
    type: String,
  },
  SType: {
    type: String,
  },
  SNo: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  ownname: {
    type: String,
  },
  image: {
    type: String,
  },
  ownnum: {
    type: Number,
  },
  mlatitude: {
    type: String,
  },
  mlongitude: {
    type: String,
  },
  pincode:{
    type:Number,
  },
  Uid:{
    type:String,
  },
  status:{
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
const MarketShops = mongoose.model('marketShops', ShopsSchema);
module.exports = {
  Market,
  MarketShops,
};
