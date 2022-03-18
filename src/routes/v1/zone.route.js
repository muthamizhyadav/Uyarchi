const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const zoneController = require('../../controllers/zone.controller')
const router = express.Router();
router
.route('/')
.post(zoneController.createZone)

router.route('/:zoneId')
.get(zoneController.getZoneDetailsById)
.put(zoneController.updateZone)
.delete(zoneController.deleteZone);

module.exports = router;