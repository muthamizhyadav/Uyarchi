const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const categoryController = require('../../controllers/category.controller')
const router = express.Router();
router
.route('/')
.post(categoryController.createCategory)


module.exports = router;