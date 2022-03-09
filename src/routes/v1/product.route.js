const express = require('express');
const productController = require('../../controllers/product.controller');
const upload  = require('../../middlewares/upload');
const router = express.Router();

router.route('/').post(upload.single('image'),productController.createProduct);


module.exports = router;
