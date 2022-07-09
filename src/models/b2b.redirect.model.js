const mongoose = require('mongoose');
const { v4 } = require('uuid');
const redirectSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  zone: {
    type: String,
  },
  ward: {
    type: String,
  },
  dummyStreet: {
    type: String,
  },
  

  
});

const reDirect = mongoose.model('redirect', redirectSchema);

module.exports = reDirect;
