const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const MenueAssign_Schema = mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  menuname: {
    type: String,
  },
  parentMenu: {
    type: String,
  },
  parentName: {
    type: String,
  },
  route: {
    type: String,
  },
  menuid: {
    type: String,
  },
  read: {
    type: Boolean,
  },
  write: {
    type: Boolean,
  },
  update: {
    type: Boolean,
  },
  delete: {
    type: Boolean,
  },
  point: {
    type: Boolean,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const MenueAssign = mongoose.model('MenueAssign', MenueAssign_Schema);
module.exports = MenueAssign;
