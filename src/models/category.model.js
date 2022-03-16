const mongoose = require('mongoose');
const {v4} = require('uuid')
const { toJSON, paginate } = require('./plugins')
const categorySchema = mongoose.Schema({
_id:{
    type:String,
    default:v4
},
category:{
    type:Array,
},
description:{
    type:String,
}
})
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);
const category = mongoose.model('Category', categorySchema);

module.exports = category;
