const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const wardAdminGroupDetailsSchema = new mongoose.Schema({
<<<<<<< HEAD

    _id: {
        type: String,
        default: v4,
    },
    productid: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    priceperkg: {
        type: Number,
    },
    OrderId: {
        type: String,
    },
    userId: {
        type: String,
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

=======
  _id: {
    type: String,
    default: v4,
  },
  productid: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  priceperkg: {
    type: Number,
  },
  wardadmingroupsId: {
    type: String,
  },
  userId: {
    type: String,
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
  orderedTime: {
    type: String,
  },
  archive: {
    type: Boolean,
    default: false,
  },
>>>>>>> 39a386c56f6b0808d981c741e1c7184e2dce5c57
});

const wardAdminGroupDetailsModel = mongoose.model('wardAdminGroupDetails', wardAdminGroupDetailsSchema);

module.exports = wardAdminGroupDetailsModel;
