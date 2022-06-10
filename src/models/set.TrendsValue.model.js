const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment')

let datenow = moment(new Date()).format("DD-MM-YYYY hh:mm A", "Asia/Kolkata");
console.log(datenow)

const setTrendsValueSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    productid: {
      type: String,
    },
    preferredQuantity: {
      type: Number,
    },
    preferredUnit: {
      type: String,
      enum: ['Kg', 'Gm', 'Bundle'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String,
      default:datenow,
    },
    archive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' },
  }
);
setTrendsValueSchema.plugin(toJSON);
setTrendsValueSchema.plugin(paginate);
const SetTrends = mongoose.model('SetTrendValue', setTrendsValueSchema);

module.exports = SetTrends;
