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
    product: {
        type: String,
    },
    QTY: {
        type: String,
    },
    pettyStock: {
        type: String,
    },
    totalQtyIncludingPettyStock: {
        type: String,
    },
    pettyStockReceiveStatus: {
        type: String,
        default: "Pending"
    },


});

const pettyStockModel = mongoose.model('pettyStockModel', pettyStockSchema);
module.exports = pettyStockModel;