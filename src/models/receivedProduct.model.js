const mongoose = require('mongoose');
const { v4, stringify } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const receivedProducrSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
});

const ReceivedProduct = mongoose.model('ReceivedProduct', receivedProducrSchema);

module.exports = ReceivedProduct;
