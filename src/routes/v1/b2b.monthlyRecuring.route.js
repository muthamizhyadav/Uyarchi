const express = require('express');
const monthlyRecuringController = require('../../controllers/b2b.monthlyRecuring.controller');
const router = express.Router();
// const  monthlyRecuring= require('../../middlewares/');

router.route('/add').post(monthlyRecuringController.createRecuring);
router.route('/getAll').get(monthlyRecuringController.getRecuring)

module.exports = router;