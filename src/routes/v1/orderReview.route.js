const express = require('express');
const orderReviewController = require('../../controllers/order.Review.controller');
const shopverify = require('../../controllers/shoptokenverify.controller');

const router = express.Router();

router.route('/').post(shopverify, orderReviewController.createOrderReview).get(orderReviewController.getAllReview);


router.route('/manage/review/getall').get(orderReviewController.getallReviews)

module.exports = router;
