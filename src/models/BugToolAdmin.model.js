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
    password:{
      type:String,
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

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
 AdminAddUserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
 AdminAddUserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

AdminAddUserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
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
const TesterReportSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    project: {
      type: String,
    },
    assignTo: {
      type: String,
    },
    category: {
      type: String,
    },   
    severity:{
      type:String,
    },
    chooseImage:{
      type:String,
    },
    testerId:{
      type:String,
    },
    summary:{
      type:String,
    },
    description:{
      type:String,
    },
    reason:{
      type:String,
    },
    status:{
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
const TesterReport = mongoose.model('testerReport', TesterReportSchema);
module.exports = { AdminAddUser, AddProjectAdmin, AddProjectAdminSeprate, TesterReport};
