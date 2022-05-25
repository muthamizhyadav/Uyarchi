const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { v4 } = require('uuid');

const trendsSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:v4
    },
    shopid:{
        type:String,
    },
    street:{
        type:String,
    },
    Uid:{
        type:String,
    },
    product:{
        type:Array
    },
    active:{
        type:Boolean,
        default:true,
    },
    archive:{
        type:Boolean,
        default:false,
    },
})

trendsSchema.plugin(toJSON);
trendsSchema.plugin(paginate);
const Trends = mongoose.model('Trends', trendsSchema);

module.exports = Trends;