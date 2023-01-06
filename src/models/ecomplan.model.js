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
  typeofplan: {
    type: String,
  },
  Duration: {
    type: String,
  },
  DurationType: {
    type: String,
  },
  DurationType: {
    type: String,
  },
  numberOfParticipants: {
    type: String,
  },
  numberofStream: {
    type: String,
  },
  validityofStream: {
    type: String,
  },
  additionalDuration: {
    type: String,
  },
  additionalParticipants: {
    type: String,
  },
  DurationIncrementCost: {
    type: String,
  },
  noOfParticipantsCost: {
    type: String,
  },
  chatNeed: {
    type: String,
  },
  commision: {
    type: String,
  },
  commition_value: {
    type: String,
  },
  post_expire_hours: {
    type: String,
  },
  post_expire_days: {
    type: String,
  },
  post_expire_minutes: {
    type: String,
  },
  regularPrice: {
    type: String,
  },
  salesPrice: {
    type: String,
  }
});
streamplanschema.plugin(toJSON);
streamplanschema.plugin(paginate);
const Streamplan = mongoose.model('streamplan', streamplanschema);

module.exports = { Streamplan };

// planName: new FormControl('', Validators.required),
//   typeofplan: new FormControl('', Validators.required),
//     expireIn: new FormControl('', Validators.required),
//       Duration: new FormControl('', Validators.required),
//         DurationType: new FormControl('', Validators.required),
//           numberOfParticipants: new FormControl('', Validators.required),
//             numberofStream: new FormControl('', Validators.required),
//               validityofStream: new FormControl('', Validators.required),
//                 additionalDuration: new FormControl('', Validators.required),
//                   additionalParticipants: new FormControl('', Validators.required),
//                     DurationIncrementCost: new FormControl('', Validators.required),
//                       noOfParticipantsCost: new FormControl('', Validators.required),
//                         chatNeed: new FormControl('', Validators.required),
//                           commision: new FormControl('', Validators.required),
//                             commition_value: new FormControl('',),
//                               post_expire_hours: new FormControl(''),
//                                 post_expire_days: new FormControl(''),
//                                   post_expire_minutes: new FormControl('', Validators.required),
//                                     regularPrice: new FormControl('', Validators.required),
//                                       salesPrice
