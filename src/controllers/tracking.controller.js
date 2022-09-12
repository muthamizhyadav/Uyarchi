const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const TrackingService = require('../services/tracking.service');

const createTracking = catchAsync(async (req, res) => {
  const tracking = await TrackingService.createTracking(req.body);
  res.send(tracking);
});

const updateTrackingById = catchAsync(async (req, res) => {
  const tracking = await TrackingService.updateTrackingById(req.params.id, req.body);
  res.send(tracking);
});

module.exports = {
  createTracking,
  updateTrackingById,
};
