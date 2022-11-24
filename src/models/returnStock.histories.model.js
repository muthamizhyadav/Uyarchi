const { boolean } = require('joi');
const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const ReturnStock_history = new mongoose.Schema({
    _id: {
        type: String,
        default: v4
    },
    groupId: {
        type: String,
    },
    returnStockId: {
        type: String,
    },
    productId: {
        type: String,
    },
    product: {
        type: String,
    },
    actualStock: {
        type: String,
    },
    mismatch: {
        type: String,
    },
    wastageStock: {
        type: String,
    },
    created: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    }
})

const ReturnStockHistory = mongoose.model('returnStockhistories', ReturnStock_history)

module.exports = ReturnStockHistory