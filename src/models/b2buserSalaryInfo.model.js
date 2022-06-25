const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { v4 } = require('uuid');


const B2BUsersSalaryInfoSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    roleId: {
        type: String,
    },
    userId: {
        type: String,
    },
    salary: {
        type: Number,
    },
    userStatus: {
        type: String,
        default: "Active"
    },
    activ: {
        type: Boolean,
        default: true,
    },
    archive: {
        type: Boolean,
        default: false,
    },
})

const b2busersalary = mongoose.model('b2bUserSalaryInfo', B2BUsersSalaryInfoSchema);

module.exports = b2busersalary
