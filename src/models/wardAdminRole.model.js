const { boolean } = require('joi');
const mongoose = require('mongoose');
const { v4 } = require('uuid');

const wardAdminRoleSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  targetValue: {
    type: String,
  },
  targetTonne: {
    type: Number,
  },
  startingValue:{
    type:String,
  },
  startingTonne:{
    type:Number,
  },
  unit:{
    type:String,
  },
  Asm: {
    type: String,
  },
  userRoleId: {
    type: String,
  },
  b2bUserId: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
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

const WardAdminRole = mongoose.model('wardAdminRole', wardAdminRoleSchema);
const wardAdminRoleAsmSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: v4,
    },
    targetValue: {
      type: String,
    },
    targetTonne: {
      type: Number,
    },
    salesman: {
      type: String,
    },
    wardAdminId: {
        type: String,
      },
    userRoleId: {
      type: String,
    },
    b2bUserId: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
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
  
  const WardAdminRoleAsm = mongoose.model('wardAdminRoleAsm', wardAdminRoleAsmSchema);

  const AsmSalesManSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: v4,
    },
    asmId: {
        type: String,
      },
    salesManId: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    reAssignDate:{
      type:String,
    },
    reAssignTime:{
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
  
  const AsmSalesMan = mongoose.model('AsmSalesMan', AsmSalesManSchema);
  const SalesManShopSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: v4,
    },
    salesManId: {
      type: String,
    },
    shopId:{
      type:String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    reAssignDate:{
      type:String,
    },
    reAssignTime:{
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
  
  const SalesManShop = mongoose.model('SalesManShop', SalesManShopSchema);

  const withoutAsmSalesmanSchema = new mongoose.Schema({
    _id: {
      type: String,
      default: v4,
    },
    targetValue: {
      type: Number,
    },
    targetTonne: {
      type: Number,
    },
    unit:{
      type:String,
    },
    salesman:{
      type:String,
    },
    date: {
      type: String,
    },
    time: {
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
  
  const WithoutAsmSalesman = mongoose.model('withoutAsmSalesman', withoutAsmSalesmanSchema);

module.exports = {WardAdminRole, WardAdminRoleAsm, AsmSalesMan, SalesManShop, WithoutAsmSalesman};