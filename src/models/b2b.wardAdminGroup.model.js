const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const wardAdminGroupSchema = new mongoose.Schema({

    _id:{
        type:String,
        default: v4,
    },
    groupId: {
        type:String,
    },
    assignDate: {
        type: String,
        default: moment().utcOffset(331).format('DD-MM-yyy'),
    },
    assignTime: {
        type: String,
    default: moment().format('h:mm a'),
    },
});

const wardAdminGroupModel = mongoose.model('wardAdminGroup', wardAdminGroupSchema);

module.exports = wardAdminGroupModel;