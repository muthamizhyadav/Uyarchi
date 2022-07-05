const express = require('express');
const attendanceController = require('../../controllers/b2bAttendance.controller');
const router = express.Router();

router.route('/').post(attendanceController.createAttendance);
router.route('/getAll').get(attendanceController.getAll);

module.exports = router;