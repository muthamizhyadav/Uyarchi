const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const apartmentSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Strid: {
    type: String,
  },
  AName: {
    type: String,
  },
  AType: {
    type: String,
  },
  AFloor: {
    type: Number,
  },
  NFlat: {
    type: Number,
  },
  Alat:{
      type:String,
  },
  Along:{
      type:String,
  },
  photoCapture: {
    type: Array,
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

// assignSchema.plugin(toJSON);
// assignSchema.plugin(paginate);

const Apartment = mongoose.model('apartment', apartmentSchema);
const shopSchema = mongoose.Schema({
    _id: {
      type: String,
      default: v4,
    },
    Strid: {
      type: String,
    },
    SType: {
      type: String,
    },
    SName: {
      type: String,
    },
    SOwner: {
      type: String,
    },
    SCont1: {
      type: Number,
    },
    Slat:{
        type:String,
    },
    Slong:{
        type:String,
    },
    photoCapture: {
      type: Array,
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
  
  // assignSchema.plugin(toJSON);
  // assignSchema.plugin(paginate);
  
  const Shop = mongoose.model('shop', shopSchema);
  

module.exports ={
    Shop,
    Apartment
}