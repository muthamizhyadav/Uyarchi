const express = require('express');
const customerIssuesController = require('../../controllers/customerIssues.controller');
const router = express.Router();

router.route('/').post(customerIssuesController.createCustomerIssues);
router.route('/manageIssues').get(customerIssuesController.getAll);
router.route('/:id').put(customerIssuesController.updateCustomerId);
module.exports = router;
