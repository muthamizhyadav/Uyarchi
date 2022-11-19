const express = require('express');
const orderReviewController = require('../../controllers/order.Review.controller');

const router = express.Router();

router.route('/').post(orderReviewController.createOrderReview).get(orderReviewController.getAllReview);

module.exports = router;
