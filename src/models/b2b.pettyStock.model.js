const mongoose = require('mongoose');
const { v4 } = require('uuid');

const moment = require('moment');

const pettyStockSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    wardAdminId: {
        type: String,
    },
    productName: {
        type: String,
    },
    productId: {
      type: String,
    },
    QTY: {
        type: String,
    },
    pettyStock: {
        type: String,
    },
    totalQtyIncludingPettyStock: {
        type: Number,
    },
    pettyStockReceiveStatus: {
        type: String,
        default: "Pending"
    },
      // stockReturnedByWDE: {
      //   type: Number,
      // },
      // wastageReturnedByWDE: {
      //   type: Number,
      // },
      // wastageImageUpload: {
      //   type: String,
      // },
      // mismatch: {
      //   type: Number,
      // },
      // DeliverAsPerSystem: {
      //   type: Number,
      // },
      // UnDeliveredAsPerSystem: {
      //   type: Number,
      // },
      date: {
        type: String,
        default: moment().utcOffset(331).format('DD-MM-yyy'),
      },
      time: {
        type: String,
        default: moment().utcOffset(331).format('h:mm a'),
      },

});

const pettyStockModel = mongoose.model('pettyStockModel', pettyStockSchema);
module.exports = pettyStockModel;