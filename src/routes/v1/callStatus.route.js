const express = require('express');
const CallStatusController = require('../../controllers/callStatus.controller');
const router = express.Router();
const stockImage = require('../../middlewares/stock');
const { getAcknowledgedData } = require('../../services/callStatus');
router.route('/').post(CallStatusController.createCallStatus);
router.route('/confirmcallstatus/:id').get(CallStatusController.getCallStatusId);
router
  .route('/:id')
  .get(CallStatusController.getCallStatusbyId)
  .put(CallStatusController.updateCallStatusById)
  .delete(CallStatusController.deleteBusinessById);
router.route('/phApproved/total').get(CallStatusController.totalAggregation);
router.route('/getAcknowledgedData/loadingExecute/:date/:page').get(CallStatusController.getAcknowledgedDataforLE)
router.route('/getSuppplier/getproduct/details/:date/:page').get(CallStatusController.getProductAndSupplierDetails);
router.route('/addVehicleDetails/:id').put(stockImage.array('weighbridgeBill'), CallStatusController.AddVehicleDetailsInCallStatus)
router.route('/getAcknowledgedData/:date/:page').get(CallStatusController.getAcknowledgedData)
router.route('/getDataByVehicleNumber/:vehicleNumber/:date/:page').get(CallStatusController.getDataByVehicleNumber)
module.exports = router;
