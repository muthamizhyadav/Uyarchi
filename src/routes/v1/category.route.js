const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const category = require('../../middlewares/category');
const subCategory = require('../../middlewares/subCategory');
const categoryController = require('../../controllers/category.controller');
const router = express.Router();

router.route('/').post(category.array('categoryImage'), categoryController.createCategory);

router
  .route('/:categoryId')
  .get(categoryController.getCategoryhDetailsById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router.route('/subCategory').post(subCategory.array('categoryImage'), categoryController.subcreateCategory);
router
  .route('/subCategory/:categoryId')
  .get(categoryController.getCategoryhDetailsById)
  .put(categoryController.updatesubCategory)
  .delete(categoryController.deleteSubCategory);
module.exports = router;
