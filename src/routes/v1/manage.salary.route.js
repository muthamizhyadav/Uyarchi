const express = require('express');
const manageSalaryController = require('../../controllers/manage.salary.controller');
const router = express.Router();

router.route('/').post(manageSalaryController.createManageSalary);

module.exports = router;
