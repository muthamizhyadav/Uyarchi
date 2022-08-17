const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const managepickupLocationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  wardId: {
    type: String,
  },
  streetId: {
    type: String,
  },
  locationName: {
    type: String,
  },
  ownerName: {
    type: String,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
  landMark: {
    type: String,
  },
  photoCapture: {
    type: Array,
  },
  latitude: {
    type: String,
  },
  langitude: {
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

const ManagePickupLocations = mongoose.model('ManagePickupLocations', managepickupLocationSchema);

module.exports = ManagePickupLocations;
