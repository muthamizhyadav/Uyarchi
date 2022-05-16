const express = require('express');
const trendsController = require('../../controllers/trends.controller');
const router = express.Router();
router.route('/').post(trendsController.createTrends).get(trendsController.getAllTrends);
router
  .route('/:trendsId')
  .get(trendsController.getTrendsById)
  .put(trendsController.updateTrendsById)
  .delete(trendsController.deleteTrendsById);


module.exports = router