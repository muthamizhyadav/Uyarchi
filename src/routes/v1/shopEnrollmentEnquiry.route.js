const express = require('express');
const router = express.Router();
const shopEnrollmentEnquiryController = require('../../controllers/shopEnrollmentEnquiry.controller');
const authorization = require('../../controllers/tokenVerify.controller');


router.route('/').post(authorization, shopEnrollmentEnquiryController.createEnquiry);
router.route('/getAllEnquiryDatas').get(shopEnrollmentEnquiryController.getAllEnquiryDatas);
module.exports = router;