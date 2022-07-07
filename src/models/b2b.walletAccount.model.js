const mongoose = require('mongoose');
const { v4 } = require('uuid');
const walletSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  uname: {
    type: String,
  },
  type: {
    type: String,
  },
  dateOpeningWallet: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  idProof: {
    type: String,
  },
  addressProof: {
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

const wallet = mongoose.model('wallet', walletSchema);

module.exports = wallet;
