const mongoose = require('mongoose');
const { v4 } = require('uuid');
const moment = require('moment');
const destoryStockSchema = mongoose.Schema({
    _id:{
        type:String,
        default: v4,
    },
    productId: {
        type: String,
    },
    wastage: {
        type: Number,
    },
    worthRupees: {
        type: Number,
    },
    date: {
        type: String,
        default: moment().utcOffset(331).format('yyy-MM-DD'),
      },
      time: {
        type: String,
        default: moment().utcOffset(331).format('h:mm a'),
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

const destoryStock = mongoose.model('destroyStock',destoryStockSchema);
module.exports = destoryStock

