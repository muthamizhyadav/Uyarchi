const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const StreetService = require('../services/street.service');

const createStreet = catchAsync(async (req, res) => {
  const street = await StreetService.createStreet(req.body);
  res.status(httpStatus.CREATED).send(street);
});

const getAllStreet = catchAsync(async (req, res) => {
  const street = await StreetService.getAllStreet();
  res.send(street);
});

const streetPagination = catchAsync(async (req, res) => {
  const pagination = await StreetService.streetPagination(req.params.id);
  res.send(pagination);
});

const getStreetByWard = catchAsync(async (req, res)=>{
  const streetWard = await StreetService.getWardByStreet(req.params.wardId)
  res.send(streetWard)
});

const streetAllocation = catchAsync(async(req,res)=>{
  const streets = await StreetService.streetAllocation(req.body)
  res.send(streets)
})

const streetDeAllocation = catchAsync(async (req, res)=>{
  const streets  = await StreetService.streetDeAllocation(req.body)
  res.send(streets)
})

const getStreetByWardId = catchAsync(async (req, res) => {
  const street = await StreetService.getStreetByWardId(req.params.wardId);
  res.send(street);
});

const getStreetDetailsById = catchAsync(async (req, res) => {
  const street = await StreetService.getStreetById(req.params.streetId);
  if (!street || street.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Street_Details not found');
  }
  res.send(street);
});

const updateStreet = catchAsync(async (req, res) => {
  const street = await StreetService.updateStreetById(req.params.streetId, req.body);
  res.send(street);
});

const deleteStreet = catchAsync(async (req, res) => {
  await StreetService.deleteStreetById(req.params.streetId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createStreet,
  getStreetDetailsById,
  updateStreet,
  deleteStreet,
  getStreetByWard,
  streetAllocation,
  streetDeAllocation,
  getStreetByWardId,
  streetPagination,
  getAllStreet,
};
