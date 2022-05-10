const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const streetSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  district: {
    type: String,
  },
  zone: {
    type: String,
  },
  ward: {
    type: String,
  },
  wardId: {
    type: String,
  },
  street: {
    type: String,
  },
  locality: {
    type: String,
  },
  area: {
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
  AllocatedUser:{
    type:String
  }
});
streetSchema.plugin(toJSON);
streetSchema.plugin(paginate);
const Street = mongoose.model('Street', streetSchema);

module.exports = Street;
