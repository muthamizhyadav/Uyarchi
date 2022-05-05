const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const streetController = require('../../controllers/street.controller')
const router = express.Router();
router
.route('/')
.post(streetController.createStreet).get(streetController.getAllStreet)

router.route('/:streetId')
.get(streetController.getStreetDetailsById)
.put(streetController.updateStreet)
.delete(streetController.deleteStreet);

router.route('/streetByWard/:wardId').get(streetController.getStreetByWardId);

router.route('/page/:id').get(streetController.streetPagination)
module.exports = router;