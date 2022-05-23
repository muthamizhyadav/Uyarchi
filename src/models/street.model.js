const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const streetSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  district: {
    type: String,
  },
  zone: {
    type: String,
  },
  ward: {
    type: String,
  },
  wardId: {
    type: String,
  },
  street: {
    type: String,
  },
  locality: {
    type: String,
  },
  area: {
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
  AllocatedUser:{
    type:String
  },
  DeAllocatedUser:{
    type:String,
  },
  AllocationStatus:{
    type:String,
    enum:['Allocated', 'DeAllocated']
  },
  closed:{
    type:String,
  },
  reason:{
    type:String,
  },
  status:{
    type:String,
  },
  date:{
    type:String,
  },
  order:{
    type:Number,
  },
});
streetSchema.plugin(toJSON);
streetSchema.plugin(paginate);
const Street = mongoose.model('Street', streetSchema);

module.exports = Street;
