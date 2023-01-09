const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const streamplanschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date
  },
  DateIso: {
    type: Number
  },
  planName: {
    type: String,
  },
  Duration: {
    type: Number,
  },
  DurationType: {
    type: String,
  },
  numberOfParticipants: {
    type: Number,
  },
  numberofStream: {
    type: Number,
  },
  validityofStream: {
    type: Number,
  },
  additionalDuration: {
    type: String,
  },
  additionalParticipants: {
    type: String,
  },
  DurationIncrementCost: {
    type: Number,
  },
  noOfParticipantsCost: {
    type: Number,
  },
  chatNeed: {
    type: String,
  },
  commision: {
    type: String,
  },
  commition_value: {
    type: Number,
  },
  post_expire_hours: {
    type: Number,
  },
  post_expire_days: {
    type: Number,
  },
  post_expire_minutes: {
    type: Number,
  },
  regularPrice: {
    type: Number,
  },
  salesPrice: {
    type: Number,
  },
  max_post_per_stream: {
    type: Number,
  },
});

const Streamplan = mongoose.model('streamplan', streamplanschema);

const streamPostschema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date
  },
  DateIso: {
    type: Number
  },
  quantity: {
    type: Number
  },
  marketPlace: {
    type: Number
  },
  offerPrice: {
    type: Number
  },
  postLiveStreamingPirce: {
    type: Number
  },
  validity: {
    type: Number
  },  DateIso: {
    type: Number
  },
  minLots: {
    type: Number
  },
  incrementalLots: {
    type: Number
  },
  productId: {
    type: String
  },
  categoryId: {
    type: String
  },
  suppierId:{
    typr:String
  }
});

const StreamPost = mongoose.model('Streampost', streamPostschema);

module.exports = { Streamplan,StreamPost };

