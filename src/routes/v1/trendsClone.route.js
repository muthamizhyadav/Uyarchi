const express = require('express');
const trendsCloneController = require('../../controllers/trendsClone.controller');
const router = express.Router();
const authorization = require('../../controllers/tokenVerify.controller');
router.route('/').post(authorization, trendsCloneController.createTrends).get(trendsCloneController.getAllTrends);
router.route('/:trendsId').get(trendsCloneController.getTrendsById).put(trendsCloneController.updateTrendsById);
router.route('/pagination/:id').get(trendsCloneController.trendsPagination);
router.route('/updateProduct/FromTrends/:id').put(trendsCloneController.updateProductFromTrendsClone);
router.route('/getAll/:wardId/:street/:page').get(trendsCloneController.getTrendsClone);
module.exports = router;
