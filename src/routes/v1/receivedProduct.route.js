const express = require('express');
const receivedProductController = require('../../controllers/receivedProduct.Controller');
const router = express.Router();

router.route('/').post(receivedProductController.createReceivedProduct);

router.route('/getAll/:page').get(receivedProductController.getAllWithPagination);
router
  .route('/:id')
  .put(receivedProductController.updateReceivedProduct)
  .delete(receivedProductController.deleteReceivedOrdersById);
module.exports = router;
