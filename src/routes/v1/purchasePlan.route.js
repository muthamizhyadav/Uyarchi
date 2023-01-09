const express = require('express');
const purchasePlan = require('../../controllers/purchasePlan.controller');
const supplierAuth = require('../../controllers/supplier.authorizations');

const router = express.Router();

router.route('/purchase/suceess').post(supplierAuth,purchasePlan.create_purchase_plan);
module.exports = router;
