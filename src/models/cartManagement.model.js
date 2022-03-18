const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const cartManagementSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
    Enum: ['new', 'old'],
  },
  image: {
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
cartManagementSchema.plugin(toJSON);
cartManagementSchema.plugin(paginate);
const CartManagement = mongoose.model('Cart', cartManagementSchema);

module.exports = CartManagement;
