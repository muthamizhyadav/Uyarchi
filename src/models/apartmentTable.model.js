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
    type: String,
  },
  NFlat: {
    type: String,
  },
  Alat: {
    type: String,
  },
  Along: {
    type: String,
  },
  photoCapture: {
    type: Array,
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
  baseImage:{
    type:String,
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
  Slat: {
    type: String,
  },
  Slong: {
    type: String,
  },
  photoCapture: {
    type: Array,
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

// assignSchema.plugin(toJSON);
// assignSchema.plugin(paginate);

const Shop = mongoose.model('shop', shopSchema);

const manageUserAttendanceSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Alat: {
    type: String,
  },
  Along: {
    type: String,
  },
  photoCapture: {
    type: String,
  },
  Uid: {
    type: String,
  },
  userName:{
    type:String,
  },
  userNo:{
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
  baseImage:{
    type:String,
  },
});

 manageUserAttendanceSchema.plugin(toJSON);
 manageUserAttendanceSchema.plugin(paginate);

const ManageUserAttendance = mongoose.model('manageUserAttendance', manageUserAttendanceSchema);
module.exports = {
  Shop,
  Apartment,
  ManageUserAttendance
};
