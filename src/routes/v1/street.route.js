const express = require('express');
const streetController = require('../../controllers/street.controller');
const router = express.Router();
router.route('/').post(streetController.createStreet).get(streetController.getAllStreet);

router
  .route('/:streetId')
  .get(streetController.getStreetDetailsById)
  .put(streetController.updateStreet)
  .delete(streetController.deleteStreet);

router.route('/updates/new').get(streetController.updates);
router.route('/streets/:AllocatedUser').get(streetController.getaggregationByUserId);
router.route('/streets/DeAllocatedUser/:AllocatedUser').get(streetController.getDeAllocationaggregationByUserId);
router.route('/streetByWard/:wardId').get(streetController.getStreetByWardId);
router.route('/street/Ward/:wardId/:status').get(streetController.getStreetByWard);
router.route('/page/:id').get(streetController.streetPagination);
router.route('/street/Allocation').post(streetController.streetAllocation).get(streetController.getAllocatedStreeOnly);
router
  .route('/street/deAllocation')
  .post(streetController.streetDeAllocation)
  .get(streetController.getAllDeAllocatedStreetOnly);
router.route('/closedStatus/:streetId').put(streetController.closedStatus);
router.route('/:id/order/street').get(streetController.streetorder);
router.route('/getall/wardid/:wardId').get(streetController.getStreetByWardId);
router.route('/Search/Api/:key').get(streetController.areaSearchApi);
module.exports = router;
