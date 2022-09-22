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

module.exports = {WardAdminRole, WardAdminRoleAsm };