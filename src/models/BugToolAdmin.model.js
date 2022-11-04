const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4 } = require('uuid');

const AdminAddUserSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    name: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    Type: {
      type: String,
    },
    OTP: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AdminAddUser = mongoose.model('BugToolUser', AdminAddUserSchema);
const AddProjectAdminSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    projectName: {
      type: String,
    },
    projectSpec: {
      type: String,
    },
    bugToolUser: {
      type: Array,
    }, 
    date:{
      type:String,
    },
    time:{
      type:String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
);
const AddProjectAdmin = mongoose.model('AddProjectAdmin', AddProjectAdminSchema);
const AddProjectAdminSeprateSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    projectName: {
      type: String,
    },
    projectSpec: {
      type: String,
    },
    bugToolUser: {
      type: String,
    },   
    bugToolUserId:{
      type:String,
    },
    date:{
      type:String,
    },
    time:{
      type:String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
);
const AddProjectAdminSeprate = mongoose.model('AddProjectAdminSeprate', AddProjectAdminSeprateSchema);
module.exports = { AdminAddUser, AddProjectAdmin, AddProjectAdminSeprate};
