const express = require('express');
const router = express.Router();
const shopEnrollmentEnquiryController = require('../../controllers/shopEnrollmentEnquiry.controller');

router.route('/').post(shopEnrollmentEnquiryController.createEnquiry);
router.route('/getAllEnquiryDatas').get(shopEnrollmentEnquiryController.getAllEnquiryDatas);
module.exports = router;