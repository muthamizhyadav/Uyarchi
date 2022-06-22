const express = require('express');
const manageExpenseController = require('../../controllers/manage.expenses.controller');
const router = express.Router();

router.route('/').post(manageExpenseController.createManageExpenses).get(manageExpenseController.getAllManageExpenses);

module.exports = router;
