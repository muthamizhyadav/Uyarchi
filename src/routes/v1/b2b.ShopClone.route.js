const express = require('express');
const b2bShopCloneController = require('../../controllers/b2b.ShopClone.Controller');
const b2bCloneshopImage = require('../../middlewares/shopCloneImage');
const AttendanceImage = require('../../middlewares/attendanceCloneImage');
const authorization = require('../../controllers/tokenVerify.controller');
const router = express.Router();

// Shop Clone
router.get('/filter/shopName/Contact/:key', b2bShopCloneController.filterShopwithNameAndContact);
router
  .route('/')
  .post(authorization, b2bCloneshopImage.array('photoCapture'), b2bShopCloneController.createB2bShopClone)
  .get(authorization, b2bShopCloneController.getAllB2BshopClone);
router.route('/aggregation/Names/:page').get(b2bShopCloneController.getshopWardStreetNamesWithAggregation);
router
  .route('/aggregation/filter/:district/:zone/:ward/:street/:status/:page')
  .get(b2bShopCloneController.getshopWardStreetNamesWithAggregation_withfilter);
router
  .route('/aggregation/filter/daily/:user/:startdata/:enddate/:starttime/:endtime/:status/:page')
  .get(b2bShopCloneController.getshopWardStreetNamesWithAggregation_withfilter_daily);

// clone
router
  .route('/aggregationgetAll/filter/:district/:zone/:ward/:street')
  .get(b2bShopCloneController.getshopWardStreetNamesWithAggregation_withfilter_all);
router
  .route('/aggregationdaily/filter/daily/:user/:startdata/:enddate/:starttime/:endtime')
  .get(b2bShopCloneController.getshopWardStreetNamesWithAggregation_withfilter_daily_all);

router

  .route('/:id')
  .get(b2bShopCloneController.getB2BShopById)
  .put(b2bShopCloneController.updateB2BShopById)
  .delete(b2bShopCloneController.deleteB2BShopById);

// Attendance Clone
router
  .route('/attendance/create/new')
  .post(authorization, AttendanceImage.array('image'), b2bShopCloneController.creatAttendanceClone_new);
router
  .route('/attendance/create')
  .post(authorization, AttendanceImage.array('image'), b2bShopCloneController.creatAttendanceClone)
  .get(authorization, b2bShopCloneController.getAlAttendanceClone);
router.route('/attendanceClone/Admin/:id/:date/:fromtime/:totime/:page').get(b2bShopCloneController.getAlAttendanceClone);
router
  .route('/attendance/:id')
  .get(authorization, b2bShopCloneController.getAttendanceById)
  .put(authorization, b2bShopCloneController.updateAttendanceById)
  .delete(authorization, b2bShopCloneController.deleteAttendanceById);

router.route('/totalCount/counts').get(authorization, b2bShopCloneController.getTotalCounts);
// getmarket shop route

router.route('/getMarket/shop/:marketId/:page').get(b2bShopCloneController.getMarkeShop);

//

router.route('/sales/registerUser').post(b2bShopCloneController.registerUser);
// router.route('/sales/forgot-password').post(b2bShopCloneController.forgotPassword);
// router.route('/sales/otpverify').post(b2bShopCloneController.verfiOtp);

// verify register Mobile OTP

router.route('/verify-RegisterOTP').post(b2bShopCloneController.verifyRegisterOTP);
router.route('/shopdetails/:id').get(b2bShopCloneController.getStreetAndShopDetails);

router
  .route('/attendanceclone/Admin/map/View/:id/:date/:fromtime/:totime')
  .get(b2bShopCloneController.getAllAttendanceCloneforMapView);

router.route('/update/data/approved/:id').put(b2bShopCloneController.updateShopStatusdataapproved);
router.route('/update/phone/approved/:id').put(b2bShopCloneController.updateShopStatusphoneapproved);
router.route('/update/kyc/approved/:id').put(b2bShopCloneController.updateShopStatuskycapproved);
router.route('/getshopData/:id').get(b2bShopCloneController.getshopDataById);
router.route('/deleteshop/permenent/:id').delete(b2bShopCloneController.perdeleteShopById);
// shop search by shop Name

router.route('/shopSearch/:key').get(b2bShopCloneController.searchShops);
router.route('/getVendorShops/uyar-dial/:key').get(b2bShopCloneController.getVendorShops);
module.exports = router;
