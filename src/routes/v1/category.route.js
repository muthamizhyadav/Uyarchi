const express = require('express');
// const customerController = require('../../controllers/customer.controller');
const categoryController = require('../../controllers/category.controller');
const router = express.Router();
router.route('/').post(categoryController.createCategory);

router
  .route('/:categoryId')
  .get(categoryController.getCategoryhDetailsById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
