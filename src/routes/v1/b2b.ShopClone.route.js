const express = require('express');
const b2bShopCloneController = require('../../controllers/b2b.ShopClone.Controller');
const b2bCloneshopImage = require('../../middlewares/shopCloneImage');
const AttendanceImage = require('../../middlewares/attendanceCloneImage');
const authorization = require('../../controllers/tokenVerify.controller');
const router = express.Router();

// Shop Clone

router
  .route('/')
  .post(authorization, b2bCloneshopImage.array('photoCapture'), b2bShopCloneController.createB2bShopClone)
  .get(authorization, b2bShopCloneController.getAllB2BshopClone);

router
  .route('/:id')
  .get(b2bShopCloneController.getB2BShopById)
  .put(b2bShopCloneController.updateB2BShopById)
  .delete(b2bShopCloneController.deleteB2BShopById);

// Attendance Clone

router
  .route('/attendance/create')
  .post( AttendanceImage.array('photoCapture'), b2bShopCloneController.creatAttendanceClone)
  .get( b2bShopCloneController.getAlAttendanceClone);

router
  .route('/attendance/:id')
  .get( b2bShopCloneController.getAttendanceById)
  .put( b2bShopCloneController.updateAttendanceById)
  .delete( b2bShopCloneController.deleteAttendanceById);

module.exports = router;
