const express = require('express');
const middleware = require('../../middlewares/vehicle');
const vehicleController = require('../../controllers/vehicle.DE.controller');
const router = express.Router();

// create Vehicle Route && fetch Active Vehicles
router
  .route('/')
  .post(middleware.fields([{ name: 'RC_book_image' }, { name: 'vehicle_image' }]), vehicleController.createVehicle)
  .get(vehicleController.getVehicle);

// fect deliveryExecutives && activeVehicles
router.route('/De/vehicles').get(vehicleController.getVehicle_and_DE);
// exports
module.exports = router;
