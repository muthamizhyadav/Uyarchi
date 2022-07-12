const mongoose = require('mongoose');
const { v4 } = require('uuid');
const redirectSchema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  street: {
    type: String,
  },
  locality: {
    type: String,
  },
  area: {
    type: String,
  },
  

  
});

const reDirect = mongoose.model('redirect', redirectSchema);

module.exports = reDirect;
