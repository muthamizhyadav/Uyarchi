const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const manageUserSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  name: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  gender: {
    type: String,
    enum:["Male","Female"],
  },
  educationQualification : {
    type: String,
  },
  mobileNumber:{
    type:Number,
  },
  mobileNumber1:{
      type:Number,
  },
  whatsappNumber:{
    type:Number,
  },
  address:{
    type:String,
  },
  preferredZone:{
    type:String,
  },
  preferredWard:{
    type:String,
  },
  pincode:{
    type:Number,
  },
  phoneModel:{
    type:String,
  },
  idProofNo:{
    type:String,
  },
  idProofUpload:{
    type:String,
  },
  addressProofNo:{
    type:String,
  },
  // addressProofUpload:{
  //   type:String,
  // },
  twoWheeler:{
    type:String,
    enum:["Yes","No"],
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
manageUserSchema.plugin(toJSON);
manageUserSchema.plugin(paginate);
const ManageUser = mongoose.model('manageUser', manageUserSchema);

module.exports = ManageUser;