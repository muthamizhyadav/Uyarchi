const express = require('express');
const customerIssuesController = require('../../controllers/customerIssues.controller');
const router = express.Router();

router.route('/').post(customerIssuesController.createCustomerIssues);

module.exports = router;
