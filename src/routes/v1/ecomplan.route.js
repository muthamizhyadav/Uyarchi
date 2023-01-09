const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const Ecomcontroller = require('../../controllers/ecomplan.controller');
const router = express.Router();
const supplierAuth = require('../../controllers/supplier.authorizations');

// plan APIS
router.route('/create/plan').post(Ecomcontroller.create_Plans)
router.route('/get/all/plan').get(Ecomcontroller.get_all_Plans)
router.route('/get/one/plan').get(Ecomcontroller.get_one_Plans)
router.route('/update/one/plan').put(Ecomcontroller.update_one_Plans)
router.route('/delete/one/plan').delete(Ecomcontroller.delete_one_Plans)

// post APIS
router.route('/create/post').post(supplierAuth,Ecomcontroller.create_post)
router.route('/get/all/post').get(supplierAuth,Ecomcontroller.get_all_post)
router.route('/get/one/post').get(supplierAuth,Ecomcontroller.get_one_post)
router.route('/update/one/post').put(supplierAuth,Ecomcontroller.update_one_post)
router.route('/delete/one/post').delete(supplierAuth,Ecomcontroller.delete_one_post)

module.exports = router;
