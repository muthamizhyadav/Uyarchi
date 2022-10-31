const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');

const VehicleSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  vehicle_type: {
    type: String,
  },
  vehicle_Name: {
    type: String,
  },
  vehicle_Owner_Name: {
    type: String,
  },
  ownerShip_Type: {
    type: String,
  },
  RC_book_image: {
    type: Array,
  },
  vehicleNo: {
    type: String,
  },
  tonne_Capacity: {
    type: String,
  },
  vehicle_image: {
    type: Array,
  },
  created: {
    type: Date,
  },
  date: {
    type: String,
  },
  time: {
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

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

module.exports = Vehicle;
