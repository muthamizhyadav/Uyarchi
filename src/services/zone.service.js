const httpStatus = require('http-status');
const { Zone } = require('../models');
// const distric = require('../services/district.service');
const ApiError = require('../utils/ApiError');
const District = require('../models/district.model');

const createZone = async (zoneBody) => {
  const { districtId } = zoneBody
  let dis = await District.findById(districtId);
  if(dis === null){
    throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
  }
  return Zone.create(zoneBody)
};

const getAllZone = async()=>{
  return Zone.find();
} 

const getZoneById = async (id) => {
  const zone = Zone.findById(id);
  return zone;
};

const queryZone = async (filter, options) => {
  return CartManagement.paginate(filter, options);
};

const updateZoneById = async (zoneId, updateBody) => {
  let zone = await getZoneById(zoneId);
  if (!zone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Zone not found');
  }
  zone = await Zone.findByIdAndUpdate({ _id: zoneId }, updateBody, { new: true });
  return zone;
};
const deleteZoneById = async (zoneId) => {
  const zone = await getZoneById(zoneId);
  if (!zone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Zone not found');
  }
  (zone.active = false), (zone.archive = true), await zone.save();
  return zone;
};
module.exports = {
  createZone,
  getAllZone,
  getZoneById,
  updateZoneById,
  deleteZoneById,
  queryZone,
};
