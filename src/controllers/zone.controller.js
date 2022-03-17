const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ZoneService = require('../services/zone.service');

const createZone = catchAsync(async (req, res) => {
    const zone = await ZoneService.createZone(req.body);
    res.status(httpStatus.CREATED).send(zone);
});

const getZoneDetailsById = catchAsync(async (req, res) => {
  const zone = await ZoneService.getZoneById(req.params.zoneId);
  if (!zone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Zone_Details not found');
  }
  res.send(zone);
});

const updateZone = catchAsync(async (req, res) => {
  const zone = await ZoneService.updateZoneById(req.params.zoneId, req.body);
  res.send(zone);
});

const deleteZone = catchAsync(async (req, res) => {
  await ZoneService.deleteZoneById(req.params.zoneId);
  res.status(httpStatus.NO_CONTENT).send();
});
  module.exports = {
    createZone,
    getZoneDetailsById,
    updateZone,
    deleteZone,
  };