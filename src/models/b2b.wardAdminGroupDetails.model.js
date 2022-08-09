const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const wardAdminGroupDetailsSchema = new mongoose.Schema({

    _id: {
        type: String,
        default: v4,
      },
      productid: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      priceperkg: {
        type: Number,
      },
      OrderId: {
        type: String,
      },
      userId: {
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

const wardAdminGroupDetailsModel = mongoose.model('wardAdminGroupDetails', wardAdminGroupDetailsSchema);

module.exports = wardAdminGroupDetailsModel;