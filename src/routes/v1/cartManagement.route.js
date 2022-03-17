const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const cartManagementController = require('../../controllers/cartManagement.controller')
const router = express.Router();
router
.route('/')
.post(cartManagementController.createCartManagement)

router.route('/:cartManagementId')
.get(cartManagementController.getCartManagementDetailsById)
.put(cartManagementController.updateCartManagement)
.delete(cartManagementController.deleteCartManagement);

module.exports = router;