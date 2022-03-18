const express = require('express');
const cartManagementController = require('../../controllers/cartManagement.controller');
const upload = require('../../middlewares/upload');
const router = express.Router();
router.route('/').post(upload.array('image'), cartManagementController.createCartManagement);

router
  .route('/:cartManagementId')
  .get(cartManagementController.getCartManagementDetailsById)
  .put(cartManagementController.updateCartManagement)
  .delete(cartManagementController.deleteCartManagement);

module.exports = router;
