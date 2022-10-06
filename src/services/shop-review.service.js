const httpStatus = require('http-status');
const ReviewShop = require('../models/shop-review.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');

const create_Shop_Review = async (body) => {
  let values = { ...body, ...{ created: moment() } };
  let ReviewShops = await ReviewShop.create(values);
  return ReviewShops;
};

const getTop_20_reviews = async (id) => {
  let values = await ReviewShop.find({shopId:id}).sort({ created: -1 }).limit(20);
  if (values.length <= 0) {
    return { message: 'No reviews' };
  }
};

module.exports = {
  create_Shop_Review,
  getTop_20_reviews,
};
