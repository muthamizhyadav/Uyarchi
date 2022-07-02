const express = require('express');
const CallStatusController = require('../../controllers/callStatus.controller');
const router = express.Router();
const stockImage = require('../../middlewares/stock');

router.route('/').post(CallStatusController.createCallStatus);
router
  .route('/:id')
  .get(CallStatusController.getCallStatusbyId)
  .put(CallStatusController.updateCallStatusById)
  .delete(CallStatusController.deleteBusinessById);
router.route('/:id/:date').put(CallStatusController.updateCallStatusById);
router.route('/getSuppplier/getproduct/details/:page').get(CallStatusController.getProductAndSupplierDetails);
router.route('/getDataWithSupplierId/:id/:page').get(CallStatusController.getDataWithSupplierId);
module.exports = router;
