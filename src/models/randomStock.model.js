const mongoose = require('mongoose');
const { v4} = require('uuid');
const moment = require('moment');

const randomStockSchema = mongoose.Schema({
    _id: {
        type: String,
        default: v4,
      },
      product:{
        type: String,
      },
      productId:{
        type: String,
      },
      NSFQ1:{
        type: String,
      },
      NSFQ2:{
        type: String,
      },
      NSFQ3:{
        type: String,
      },
      NSFW_Wastage:{
        type: String,
      },
      wastedImageFile:{
        type: String,
      },
      date: {
        type: String,
        default: moment().utcOffset(330).format('yyy-MM-DD'),
      },
      time: {
        type: String,
        default: moment().utcOffset(330).format('h:mm a'),
      },
      active: {
        type: Boolean,
        default: true,
      },
      archive: {
        type: Boolean,
        default: false,
      },

    });

      const randomStockModel = mongoose.model('randomStockEntry',randomStockSchema);

      module.exports = randomStockModel;
