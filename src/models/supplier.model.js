const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const bcrypt = require('bcryptjs');

const supplierSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  tradeName: {
    type: String,
  },
  companytype: {
    type: String,
    enum: ['Proprietorship', 'LLP', 'Partnership', 'Private Limited', 'Public Limited', 'Others', 'Individual'],
  },
  primaryContactNumber: {
    type: String,
  },
  primaryContactName: {
    type: String,
  },
  secondaryContactName: {
    type: String,
  },
  secondaryContactNumber: {
    type: String,
  },
  RegisteredAddress: {
    type: String,
  },
  OfficeStaffnumber: {
    type: Number,
  },
  ShopNo: {
    type: String,
  },
  countries: {
    type: String,
  },
  state: {
    type: String,
  },
  district: {
    type: String,
  },
  gpsLocat: {
    type: String,
  },
  gstNo: {
    type: String,
  },
  email: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  productDealingWith: {
    type: Array,
  },
  createdByStatus: {
    type: String,
  },
  approvedStatus: {
    type: String,
  },
  password: {
    type: String,
  },
  productSold: {
    type: String,
  },
  ShopSize: {
    type: String,
  },
  image: {
    type: Array,
  },
  GateEntryconvenience: {
    type: Number,
  },
  created: {
    type: Date,
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

supplierSchema.plugin(toJSON);
supplierSchema.plugin(paginate);
supplierSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

supplierSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
