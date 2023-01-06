const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const streamplanschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  PlanName: {
    type: String,
  },
  No_of_Stream: {
    type: String,
  },
  Duration: {
    type: String,
  },
  ChatNeed: {
    type: String,
  },
  No_Of_Participents: {
    type: String,
  },
  Validity_of_Stream: {
    type: String,
  },
  ExpireIn: {
    type: String,
  },
  Commision: {
    type: String,
  },
  IfFixed: {
    type: String,
  },
  IfPercentage: {
    type: String,
  },
  created:{
    type: Date
  },
  DateIso:{
    type: Number
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
streamplanschema.plugin(toJSON);
streamplanschema.plugin(paginate);
const Streamplan = mongoose.model('streamplan', streamplanschema);

module.exports = {Streamplan};
