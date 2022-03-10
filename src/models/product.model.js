
const mongoose = require('mongoose');
const {v4} = require('uuid')
const { toJSON, paginate } = require('./plugins');
const productSchema = mongoose.Schema({
    _id:{
        type:String,
        default:v4
    },
    productTitle:{
        type:String,
    },
    category:{
        type:Array,
        default:[],
    },
    subCategory:{
        type:Array,
        default:[],
    },
    unit:{
        type:Number,
    },
    tags:{
        type:String,
    },
    image:{
        type:String,
    },
    description:{
        type:String,
    },
})
productSchema.plugin(toJSON);
productSchema.plugin(paginate);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

