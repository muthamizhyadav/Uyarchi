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
    OrderId:{
        type: String,
    },
    status: {
        type: String,
        default: "Pending",
    },
    product: {
        type: Array,
        default: [],
      },
      totalItems:{
        type: Number,
      },
      street: {
        type: String,
      },
      orderedTime: {
        type: String,
      },
      Orderdatas: {
        type: Array,
        default: [],
      },
});

const wardAdminGroupModel = mongoose.model('wardAdminGroup', wardAdminGroupSchema);

module.exports = wardAdminGroupModel;