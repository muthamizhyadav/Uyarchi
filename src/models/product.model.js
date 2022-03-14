
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
    subscrption:{
        type:String,
        enum:['yes','no']
    },

    enquiry:{
        type:String,
        enum:['yes','no'],
    },
    salePrice:{
        type:Number
    },
    purchasePrice:{
        type:Number
    },
    shippingPrice:{
        type:Number
    },
    productTax:{
        type:Number
    },
    productDiscount:{
        type:Number
    },
    needBidding:{
        type:String,
        enum:['yes','no']
    },
    biddingStartDate:{
        type:Date
    },
    biddingStartTime:{
        type:String,
    },
    biddingEndDate:{
        type:Date,
    },
    biddingEndTime:{
        type:String
    },
    maxBidAomunt:{
        type:Number,
    },
    minBidAmount:{
        type:Number
    },
})
productSchema.plugin(toJSON);
productSchema.plugin(paginate);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

