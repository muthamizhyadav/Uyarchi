const express = require('express');
const CallStatusController = require('../../controllers/callStatus.controller');
const router = express.Router();
const stockImage = require('../../middlewares/stock');

router.route('/getConfirmed/stock/:date/:page').get(CallStatusController.getConfirmedStockStatus)
router.route('/').post(CallStatusController.createCallStatus);
router.route('/confirmcallstatus/:id').get(CallStatusController.getCallStatusId);
router
  .route('/:id')
  .get(CallStatusController.getCallStatusbyId)
  .put(CallStatusController.updateCallStatusById)
  .delete(CallStatusController.deleteBusinessById);
router.route('/phApproved/total').get(CallStatusController.totalAggregation);
router.route('/getAcknowledgedData/loadingExecute/:date/:page').get(CallStatusController.getAcknowledgedDataforLE);
router.route('/getSuppplier/getproduct/details/:date/:page').get(CallStatusController.getProductAndSupplierDetails);
router
  .route('/addVehicleDetails/:id')
  .put(stockImage.array('weighbridgeBill'), CallStatusController.AddVehicleDetailsInCallStatus);
router.route('/getAcknowledgedData/:date/:page').get(CallStatusController.getAcknowledgedData);
router.route('/getDataByVehicleNumber/:vehicleNumber/:date/:page').get(CallStatusController.getDataByVehicleNumber);

router.route('/getLoadedData/:date/:page').get(CallStatusController.getOnlyLoadedData);

module.exports = router;
