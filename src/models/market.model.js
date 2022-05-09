const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const marketSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    MName: {
      type: String,
    },
    locality: {
      type: String,
    },
    Address1: {
      type: String,
    },
    Address2: {
      type: String,
    },
    pincode:{
        type:Number,
    },
    LandMark:{
        type:String,
    },
    image:{
        type:String,
    },
    mlongitude:{
      type:String,
    },
    mlatitude:{
      type:String,
    },
    active: {
        type: Boolean,
        default: true,
      },
      archive: {
        type: Boolean,
        default: false,
      },
}
);
const market = mongoose.model('market', marketSchema);

module.exports = market;