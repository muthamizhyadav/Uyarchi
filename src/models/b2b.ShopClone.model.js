const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const shopSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Strid: {
    type: String,
  },
  SType: {
    type: String,
  },
  SName: {
    type: String,
  },
  SOwner: {
    type: String,
  },
  SCont1: {
    type: Number,
  },
  Slat: {
    type: String,
  },
  Slong: {
    type: String,
  },
  photoCapture: {
    type: Array,
  },
  Uid: {
    type: String,
  },
  status: {
    type: String,
  },
  reason: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  created: {
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
  reason: {
    type: String,
  },
});

// assignSchema.plugin(toJSON);
// assignSchema.plugin(paginate);

const Shop = mongoose.model('B2BshopClone', shopSchema);

module.exports = Shop;
