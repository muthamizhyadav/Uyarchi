const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const apartmentSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  selectStreet: {
    type: String,
  },
  apartmentName: {
    type: String,
  },
  apartmentType: {
    type: String,
  },
  numberOfFloors: {
    type: Number,
  },
  numberOfFlats: {
    type: Number,
  },
  latitude:{
      type:String,
  },
  landitude:{
      type:String,
  },
  photoCapture: {
    type: Array,
  },
  manageUserId:{
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
    selectStreet: {
      type: String,
    },
    shopType: {
      type: String,
    },
    shopName: {
      type: String,
    },
    nameOfOwner: {
      type: String,
    },
    contactNumber: {
      type: Number,
    },
    latitude:{
        type:String,
    },
    landitude:{
        type:String,
    },
    photoCapture: {
      type: Array,
    },
    manageUserId:{
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