const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const Ecomcontroller = require('../../controllers/ecomplan.controller');
const router = express.Router();
router.route('/create/plan').post(Ecomcontroller.create_Plans)
router.route('/get/all/plan').get(Ecomcontroller.get_all_Plans)

module.exports = router;
