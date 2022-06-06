const express = require('express');
const brandimage = require('../../middlewares/brand');
const router = express.Router();
const brand = require('../../controllers/brand.controller');
router.route('/').post(brandimage.array('image'), brand.createbrand).get(brand.getbrand);
router.route('/:brandId').put(brandimage.array('image'), brand.updateShop).get(brand.getBrandServicebyId);
router.route('/:categoryId/:subcategoryId').get(brand.getcategorySubCategories);
router.route('/brands/pagination/:page').get(brand.brandPagination)

module.exports = router;
