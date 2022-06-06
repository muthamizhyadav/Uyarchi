const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const category = require('../../middlewares/category');
const subCategory = require('../../middlewares/subCategory');
const categoryController = require('../../controllers/category.controller');
const router = express.Router();

router
  .route('/')
  .post(category.array('categoryImage'), categoryController.createCategory)
  .get(categoryController.getAllCategory);

router
  .route('/:categoryId')
  .get(categoryController.getCategoryhDetailsById)
  .put(category.array('categoryImage'), categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

router
  .route('/sub/category')
  .post(subCategory.array('categoryImage'), categoryController.subcreateCategory)
  .get(categoryController.getAllSubCategory);
// router
//   .route('/sub/Category/:subcategoryId')
//   .get(categoryController.getCategoryhDetailsById)
//   .put(categoryController.updatesubCategory)
//   .delete(categoryController.deleteSubCategory);
// router.route

router
  .route('/sub/:subcategoryId')
  .get(categoryController.getSubCategoryhDetailsById)
  .put(subCategory.array('categoryImage'), categoryController.updatesubCategory)
  .delete(categoryController.deleteSubCategory);
router.route('/subcat/main/:id').get(categoryController.getsubcategoryusemain);
router.route('/category/pagination/:page').get(categoryController.categoryPagination);
router.route('/subcategory/pagination/:page').get(categoryController.subcategoryPagination);
module.exports = router;
