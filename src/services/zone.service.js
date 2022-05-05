const httpStatus = require('http-status');
const { Zone } = require('../models');
// const distric = require('../services/district.service');
const ApiError = require('../utils/ApiError');
const District = require('../models/district.model');

const createZone = async (zoneBody) => {
  const { districtId } = zoneBody;
  let dis = await District.findById(districtId);
  let values = {};
  values = { ...zoneBody, ...{ district: dis.district } };
  if (dis === null) {
    throw new ApiError(httpStatus.NO_CONTENT, '!oops 🖕');
  }
  return Zone.create(values);
};

const getAllZone = async () => {
  return Zone.find();
};

const zonePagination = async (id) => {
  console.log(id);
  return Zone.aggregate([
    { $sort: { sqlZoneId: 1 } },
    {
      $lookup: {
        from: 'districts',
        localField: 'districtId',
        foreignField: '_id',
        as: 'districtData',
      },
    },
    {
      $unwind: '$districtData',
    },
    {
      $project: {
        id: 1,
        zone: 1,
        zoneCode: 1,
        districtId: 1,
        district: '$districtData.district',
      },
    },
    { $skip: 20 * id },
    { $limit: 20 },
  ]);
};

const getZoneByDistrict = async (districtId) => {
  const dis = await Zone.find({ districtId });
  if (dis === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'District Id Is incorrect');
  }
  return dis;
};

const getZoneById = async (id) => {
  const zone = Zone.findById(id);
  return zone;
};

const queryZone = async (filter, options) => {
  return CartManagement.paginate(filter, options);
};

// const getZOnes = async ()=>{
// return ward;
// }

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
  getZoneByDistrict,
  getZoneById,
  updateZoneById,
  zonePagination,
  // getZOnes,
  deleteZoneById,
  queryZone,
};
