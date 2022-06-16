const express = require('express');
const CallStatusController = require('../../controllers/callStatus.controller');
const router = express.Router();
const stockImage = require('../../middlewares/stock')
router.route('/').post(CallStatusController.createCallStatus);
router.route('/confirmcallstatus/:id').get(CallStatusController.getCallStatusId);
router
  .route('/:id')
  .get(CallStatusController.getCallStatusbyId)
  .put(CallStatusController.updateCallStatusById)
  .delete(CallStatusController.deleteBusinessById);
router.route('/phApproved/total').get(CallStatusController.totalAggregation);
router.route('/getSuppplier/getproduct/details/:date/:page').get(CallStatusController.getProductAndSupplierDetails);
router.route('/addVehicleDetails/:id').put(stockImage.array('weighbridgeBill'), CallStatusController.AddVehicleDetailsInCallStatus)
module.exports = router;
