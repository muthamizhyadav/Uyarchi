const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { email } = require('../config/config');
const { toJSON, paginate } = require('./plugins');

// const variables = {
//   uname,
//   email,
//   phone,
//   whnumber,
//   lannumber,
//   address,
//   addresslinetwo,
//   pinCode,
//   idproofno,
//   idproof,
//   addproof,
//   addsproof, //image
//   biodata,
//   roletype,
//   bankname,
//   branch,
//   accno,
//   ifsc,
// };
const manageBusinessUsersSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  uname:{
      type:String,
  },
  email:{
      type:String,
  },
  phone:{
      type:Number,
  },
  whnumber:{
      type:Number,
  },
  lannumber:{
      type:Number,
  },
  address:{
      type:String,
  },
  addresslinetwo:{
      type:String,
  },
  pinCode:{
      type:Number
  },
  idproofno:{
      type:String,
  },
  idproof:{
      type:String,
  },
  addproof:{
      type:String,
  },
  addsproof:{
      type:String,
  },
  biodata:{
      type:String,
  },
  roletype:{
      type:String,
  },
  bankname:{
      type:String,
  },
  branch:{
      type:String,
  },
  accno:{
      type:String,
  },
  ifsc:{
      type:String,
  },
  active:{
      type:Boolean,
      default:true,
  },
  archive:{
      type:Boolean,
      default:false,
  },
});


manageBusinessUsersSchema.plugin(toJSON);
manageBusinessUsersSchema.plugin(paginate);
const ManageBusinessUser = mongoose.model('manageBusinessUsers', manageBusinessUsersSchema);

module.exports = ManageBusinessUser;
