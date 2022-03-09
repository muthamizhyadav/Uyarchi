const express = require('express');
const customerController = require('../../controllers/customer.controller');


const router = express.Router();

router
  .route('/register')
  .post(customerController.createCustomer)
router.post('/login', customerController.login);

module.exports = router;
