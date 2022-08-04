const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const wardAdminGroupSchema = new mongoose.Schema({

    _id:{
        type:String,
        default: v4,
    },
    




});

const wardAdminGroupModel = mongoose.model('wardAdminGroup', wardAdminGroupSchema);

module.exports = wardAdminGroupModel;