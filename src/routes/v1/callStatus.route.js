const express = require('express');
const CallStatusController = require('../../controllers/callStatus.controller');
const router = express.Router();

router.route('/').post(CallStatusController.createCallStatus);
router.route('/confirmcallstatus/:id').get(CallStatusController.getCallStatusId)
router
  .route('/:id')
  .get(CallStatusController.getCallStatusbyId)
  .put(CallStatusController.updateCallStatusById)
  .delete(CallStatusController.deleteBusinessById);

module.exports = router;
