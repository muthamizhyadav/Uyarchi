const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const manageSalarySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  salary: {
    type: Number,
  },
  userid: {
    type: String,
  },
  date: {
    type: String,
  },
  time: String,
  active: {
    type: Boolean,
    default: true,
  },
  archive: {
    type: Boolean,
    default: false,
  },
});

const manageSalary = mongoose.model('manageSalary', manageSalarySchema);

module.exports = manageSalary;