const express = require('express');
const apartmentController = require('../../controllers/apartmentTable.controller');
const shopImage = require('../../middlewares/shopImage')
const apartmentImage = require('../../middlewares/apartmentImage')
const router = express.Router();

router.route('/').post(apartmentImage.array('photoCapture'), apartmentController.createapartmentTableService).get(apartmentController.getAllApartment);
router.route('/shop').post(shopImage.array('photoCapture'),apartmentController.createshopTableService).get(apartmentController.getAllShop)

router
  .route('/:apartmentId')
  .get(apartmentController.getApartmentById)
  .put(apartmentImage.array('photoCapture'), apartmentController.updateApartment)
  .delete(apartmentController.deleteApartment);

  router
  .route('/:shopId')
  .get(apartmentController.getShopById)
  .put(shopImage.array('photoCapture'), apartmentController.updateShop)
  .delete(apartmentController.deleteshop);

module.exports = router;
