const express = require('express');
const trendsCloneController = require('../../controllers/trendsClone.controller');
const router = express.Router();
router.route('/').post(trendsCloneController.createTrends).get(trendsCloneController.getAllTrends);
router.route('/:trendsId').get(trendsCloneController.getTrendsById).put(trendsCloneController.updateTrendsById);
router.route('/pagination/:id').get(trendsCloneController.trendsPagination);
router.route('/updateProduct/FromTrends/:id').put(trendsCloneController.updateProductFromTrendsClone);
module.exports = router;
