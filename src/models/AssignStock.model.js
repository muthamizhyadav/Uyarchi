const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const assignSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  type: {
    type: String,
  },
  quantity: {
    type: String,
  },
  price: {
    type: Number,
  },
  productId: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  usablestockId: {
    type: String,
  },
  
});

assignSchema.plugin(toJSON);
assignSchema.plugin(paginate);

const AssignStock = mongoose.model('AssignStock', assignSchema);

module.exports = AssignStock;
