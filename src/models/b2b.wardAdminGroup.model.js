const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const wardAdminGroupSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  groupId: {
    type: String,
  },
  assignDate: {
    type: String,
  },
  assignTime: {
    type: String,
  },
  Orderdatas:{
    type: Array,
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },

  archive: {
    type: Boolean,
    default: false,
  },
  deliveryExecutiveId: {
    type: String,
  },

  totalOrders: {
    type: Number,
  },
  // status: {
  //   type: String,
  //   default: "Assigned",
  // },

});

const wardAdminGroupModel = mongoose.model('wardAdminGroup', wardAdminGroupSchema);

module.exports = wardAdminGroupModel;
