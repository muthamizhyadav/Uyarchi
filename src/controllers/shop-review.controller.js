const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Shop_review_Service = require('../services/shop-review.service');

const create_Shop_Review = catchAsync(async (req, res) => {
  const shopReview = await Shop_review_Service.create_Shop_Review(req.body);
  await shop.save();
  res.send(shopReview);
});

const getTop_20_reviews = catchAsync(async (req, res) => {
  const shopReview = await Shop_review_Service.getTop_20_reviews(req.params.id);
  res.send(shopReview);
});

module.exports = {
  create_Shop_Review,
  getTop_20_reviews,
};
