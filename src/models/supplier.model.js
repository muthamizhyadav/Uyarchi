const mongoose = require('mongoose');
const {v4} = require('uuid')
const { toJSON, paginate } = require('./plugins')

const supplierSchema =  new mongoose.Schema({
    _id:{
        type:String,
        default:v4
    },
    supplierName:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
})

supplierSchema.plugin(toJSON);
supplierSchema.plugin(paginate);
const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
