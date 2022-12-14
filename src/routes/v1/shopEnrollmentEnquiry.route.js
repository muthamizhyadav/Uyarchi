const express = require('express');
const router = express.Router();
const shopEnrollmentEnquiryController = require('../../controllers/shopEnrollmentEnquiry.controller');
const authorization = require('../../controllers/tokenVerify.controller');
const b2bCloneshopImage = require('../../middlewares/shopCloneImage');


router.route('/').post(authorization, shopEnrollmentEnquiryController.createEnquiry);
router.route('/getAllEnquiryDatas/:pincode').get(shopEnrollmentEnquiryController.getAllEnquiryDatas);
router.route('/update/:id').get(shopEnrollmentEnquiryController.updateEnquiryById);

router.route('/AssignShops').post(shopEnrollmentEnquiryController.AssignShops);
router.route('/pincode').get(shopEnrollmentEnquiryController.pincode);
router.route('/viewdatagetById/:id').get(shopEnrollmentEnquiryController.viewdatagetById);

router.route('/createShops').post(b2bCloneshopImage.array('photoCapture'), shopEnrollmentEnquiryController.createShops);
module.exports = router;