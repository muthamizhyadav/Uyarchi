const express = require('express');
const router = express.Router();
const shopEnrollmentEnquiryController = require('../../controllers/shopEnrollmentEnquiry.controller');
const authorization = require('../../controllers/tokenVerify.controller');


router.route('/').post(authorization, shopEnrollmentEnquiryController.createEnquiry);
router.route('/getAllEnquiryDatas/:pincode').get(shopEnrollmentEnquiryController.getAllEnquiryDatas);
router.route('/update/:id').get(shopEnrollmentEnquiryController.updateEnquiryById);

router.route('/AssignShops').post(shopEnrollmentEnquiryController.AssignShops);
module.exports = router;