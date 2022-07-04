const express = require('express');
const receivedProductController = require('../../controllers/receivedProduct.Controller');
const router = express.Router();

router.route('/').post(receivedProductController.createReceivedProduct);

router.route('/getAll/:page').get(receivedProductController.getAllWithPagination);
router.route('/getloaded/:page').get(receivedProductController.getAllWithPagination_loaded);
router
  .route('/:id')
  .put(receivedProductController.updateReceivedProduct)
  .delete(receivedProductController.deleteReceivedOrdersById);
router.route('/BillNumber/:id').put(receivedProductController.BillNumber);
module.exports = router;
