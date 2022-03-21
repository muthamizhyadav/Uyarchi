const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const streetController = require('../../controllers/street.controller')
const router = express.Router();
router
.route('/')
.post(streetController.createStreet)

router.route('/:streetId')
.get(streetController.getStreetDetailsById)
.put(streetController.updateStreet)
.delete(streetController.deleteStreet);

module.exports = router;