const httpStatus = require('http-status');
const { Ward } = require('../models');
const Zone = require('../models/zone.model');
const ApiError = require('../utils/ApiError');

const createWard = async (wardBody) => {
  const { zone, zoneId } = wardBody;
  console.log(zoneId);
  let zon = await Zone.findById(zoneId);
  if (zon === null) {
    throw new ApiError(httpStatus.NOT_FOUND, '! 🖕oops');
  }
  return Ward.create(wardBody);
};

const getWardById = async (id, active) => {
  const ward = await Ward.findById(id);
  return ward;
};

const getAllWard = async () => {
  return Ward.aggregate([
    {
      $lookup: {
        from: 'zones',
        localField: 'zoneId',
        foreignField: '_id',
        as: 'zoneData',
      },
    },
    {
      $unwind: '$zoneData',
    },
    {
      $lookup: {
        from: 'districts',
        localField: 'district',
        foreignField: '_id',
        as: 'districtData',
      },
    },
    {
      $unwind: '$districtData',
    },
    {
      $project: {
        districtName: '$districtData.district',
        zoneName: '$zoneData.zone',
        zoneCode: '$zoneData.zoneCode',
        district: 1,
        zoneId: 1,
        ward: 1,
        wardNo: 1,
      },
    },
  ]);
};

const getWardByZoneId = async (zoneId) => {
  console.log(zoneId);
  const zone = await Ward.aggregate([
    {
      $match:{
        $and:[{zoneId:{$eq:zoneId}}]
      }
    }
  ]);
  return zone;
};

const wardPagination = async (id) => {
  console.log(id);
  return Ward.aggregate([
    {
      $sort: {
        ward: 1,
      },
    },
    {
      $lookup: {
        from: 'zones',
        localField: 'zoneId',
        foreignField: '_id',
        as: 'zoneData',
      },
    },
    {
      $unwind: '$zoneData',
    },
    {
      $lookup: {
        from: 'districts',
        localField: 'district',
        foreignField: '_id',
        as: 'districtData',
      },
    },
    {
      $unwind: '$districtData',
    },
    {
      $project: {
        districtName: '$districtData.district',
        zoneName: '$zoneData.zone',
        zoneCode: '$zoneData.zoneCode',
        district: 1,
        zoneId: 1,
        ward: 1,
        wardNo: 1,
      },
    },
    { $skip: 20 * id },
    { $limit: 20 },
  ]);
};

const getAllWardsForManageTrends = async () =>{
  return await Ward.aggregate([{
      $sort: {
        ward: 1,
    }
  }])


}
const querWard = async (filter, options) => {
  return Ward.paginate(filter, options);
};

const updatewardById = async (wardId, updateBody) => {
  let ward = await getWardById(wardId);
  if (!ward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ward not found');
  }
  ward = await Ward.findByIdAndUpdate({ _id: wardId }, updateBody, { new: true });
  return ward;
};

const deleteWardById = async (wardId) => {
  const ward = await getWardById(wardId);
  if (!ward) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ward not found');
  }
  (ward.active = false), (ward.archive = true), await ward.save();
  return ward;
};

module.exports = {
  createWard,
  getWardByZoneId,
  getWardById,
  getAllWard,
  updatewardById,
  deleteWardById,
  wardPagination,
  getAllWardsForManageTrends
};
