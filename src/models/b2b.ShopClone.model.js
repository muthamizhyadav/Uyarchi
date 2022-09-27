const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

//shop clone Schema

const shopSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Strid: {
    type: String,
  },
  Wardid: {
    type: String,
  },
  SType: {
    type: String,
  },
  address: {
    type: String,
  },
  shopNo: {
    type: String,
  },
  SName: {
    type: String,
  },
  SOwner: {
    type: String,
  },
  mobile: {
    type: String,
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
    default: 'Pending',
  },
  whatsappnumber: {
    type: Number,
  },
  alternatenumber: {
    type: Number,
  },
  kyc_status: {
    type: String,
    default: 'Pending',
  },
  reason: {
    type: String,
  },
  date: {
    type: String,
  },
  filterDate: {
    type: String,
  },
  time: {
    type: Number,
  },
  created: {
    type: String,
  },
  callingStatus: {
    type: String,
    default: 'Pending',
  },
  callingStatusSort: {
    type: Number,
    default: 1,
  },
  callingUserId: {
    type: String,
  },
  sortdate: {
    type: String,
  },
  sorttime: {
    type: Number,
  },
  marketId: {
    type: String,
  },
  historydate: {
    type: String,
  },
  shopNo: {
    type: String,
  },
  shopMobile: {
    type: String,
  },
  secondShop: {
    type: String,
    default: 'false',
  },
  CallStatus: {
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
  type: {
    type: String,
  },
  salesManStatus: {
    type: String,
  },
  registered: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
});

// assignSchema.plugin(toJSON);
// assignSchema.plugin(paginate);

const Shop = mongoose.model('B2BshopClone', shopSchema);

// Attendance Schema

const attendanceSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Alat: {
    type: String,
  },
  Along: {
    type: String,
  },
  photoCapture: {
    type: Array,
  },
  Uid: {
    type: String,
  },
  wardId: {
    type: String,
  },
  created: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: Number,
  },
  type: {
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
  image: {
    type: String,
  },
});
const AttendanceClone = mongoose.model('AttendanceClone', attendanceSchema);

const attendanceSchemaclone = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  Alat: {
    type: String,
  },
  Along: {
    type: String,
  },
  photoCapture: {
    type: Array,
  },
  Uid: {
    type: String,
  },
  wardId: {
    type: String,
  },
  created: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: Number,
  },
  type: {
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
  image: {
    type: String,
  },
});

const AttendanceClonenew = mongoose.model('AttendanceClonenew', attendanceSchemaclone);

module.exports = { Shop, AttendanceClone, AttendanceClonenew };
