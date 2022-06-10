const express = require('express');
const b2bShopCloneController = require('../../controllers/b2b.ShopClone.Controller');
const b2bCloneshopImage = require('../../middlewares/shopCloneImage');

const router = express.Router();

router
  .route('/')
  .post(b2bCloneshopImage.array('photoCapture'), b2bShopCloneController.createB2bShopClone)
  .get(b2bShopCloneController.getAllB2BshopClone);

router
  .route('/:id')
  .get(b2bShopCloneController.getB2BShopById)
  .put(b2bShopCloneController.updateB2BShopById)
  .delete(b2bShopCloneController.deleteB2BShopById);

module.exports = router;
