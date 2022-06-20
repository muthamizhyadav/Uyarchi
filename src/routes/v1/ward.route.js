const express = require('express');
const wardController = require('../../controllers/ward.controller');
const authorization = require('../../controllers/tokenVerify.controller');
const router = express.Router();

router.route('/').post(wardController.createWard).get(wardController.getAllWard);
router.route('/page/:id').get(wardController.wardPagination);
router.route('/:wardId').get(wardController.getward).put(wardController.updateward).delete(wardController.deleteWard);
router.route('/wardByZone/:zoneId').get(wardController.getWardByZoneId);
router.route('/getWard/ForManageTrends').get(wardController.getAllWardsForManageTrends)
router.route('/shopOrder/metadata').get(authorization, wardController.getmetaData);
module.exports = router;
