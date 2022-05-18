const express = require('express');
const apartmentController = require('../../controllers/apartmentTable.controller');
const shopImage = require('../../middlewares/shopImage');
const apartmentImage = require('../../middlewares/apartmentImage');
const manageUserAttendance = require('../../middlewares/manageUserAttendanceImage');
// const userValidation = require('../../validations/user.validation');

const router = express.Router();

router
  .route('/')
  .post(apartmentImage.array('photoCapture'), apartmentController.createapartmentTableService)
  .get(apartmentController.getAllApartment);
router
  .route('/shop')
  .post(shopImage.array('photoCapture'), apartmentController.createshopTableService)
  .get(apartmentController.getAllShop);
router.route('/manageUserAttendance').post(apartmentController.createManageUserAttendanceService);
router.route('/shopAndApartment/same').get(apartmentController.getallShopApartment)
// router.route('/getAllAttendance').get(validate(userValidation.getUsersAttendance), apartmentController.getManageUserAttendance);
router.route('/getAllAttendance/:ID/:DATE/:TIME/:PAGE').get(apartmentController.getmanageUSerAttendanceAll);
router.route('/Search').post(apartmentController.getSearchUser);
router.route('/getAllAttendance/:id/:date/:fromtime/:totime/:page').get(apartmentController.getmanageUSerAttendanceAll);
router.route('/Search').post(apartmentController.getSearchUser)
router.route('/manageUserAttendanceAuto').post(apartmentController.createManageUserAttendanceAutoService).get(apartmentController.getAllmanageUserAttendanceAuto)
router
  .route('/:apartmentId')
  .get(apartmentController.getApartmentById)
  .put(apartmentImage.array('photoCapture'), apartmentController.updateApartment)
  .delete(apartmentController.deleteApartment);

router
  .route('/shop/:shopId')
  .get(apartmentController.getShopById)
  .put(shopImage.array('photoCapture'), apartmentController.updateShop)
  .delete(apartmentController.deleteshop);
router.route('/apartment/aggregation').get(apartmentController.shopApartmentAggregation);
module.exports = router;
