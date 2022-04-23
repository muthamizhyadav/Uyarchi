const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const ShopOrderPriceSchema = new mongoose.Schema({
    _id:{
        type:String,
        default:v4,
    },
    date:{
        type:String,
    },
    time:{
        type:String,
    },
    shopName:{
        type:String,
        default:"",
    },
    product:{
        type:Array,
        default:[],
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

ShopOrderPriceSchema.plugin(toJSON);
ShopOrderPriceSchema.plugin(paginate);
const ShopOrder = mongoose.model('ShopOrder', ShopOrderPriceSchema);

module.exports = ShopOrder;