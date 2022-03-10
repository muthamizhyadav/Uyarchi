const mongoose = require('mongoose');
const {v4} = require('uuid');
const { toJSON, paginate } = require('./plugins');


const customerSchema = mongoose.Schema({
  _id:{
    type:String,
    default:v4,
  },
  firstName:{
    type:String,
  },

  lastName:{
    type:String,
  },
  email:{
    type:String
  },
  phone:{
    type:Number,
  },
  password:{
    type:String,
  },
  confirmPassword:{
    type:String,
  },
  address:{
    type:String
  },
  country:{
    type:String,
  },
  state:{
    type:String
  },
  city:{
    type:String,
  },
  pinCode:{
    type:String
  },
})


customerSchema.plugin(toJSON);
customerSchema.plugin(paginate);
const Customer = mongoose.model('customer', customerSchema);

module.exports = Customer;