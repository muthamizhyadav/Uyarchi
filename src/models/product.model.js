
const mongoose = require('mongoose');
const {v4} = require('uuid')
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
        type:String,
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

