const httpStatus = require('http-status');
const { Street } = require('../models');
const ApiError = require('../utils/ApiError');
const Ward = require('../models/ward.model');
const ManageUser = require('../models/manageUser.model');
const Streets = require('../models/street.model');

const createStreet = async (streetBody) => {
  const { wardId } = streetBody;
  let war = await Ward.findById(wardId);
  let values = {};
  values = { ...streetBody, ...{ ward: war.ward } };
  if (war === null) {
    throw new ApiError(httpStatus.NO_CONTENT, '!oops');
  }
  return Street.create(values);
};

const getStreetById = async (id) => {
  const street = Street.findById(id);
  return street;
};

const streetAllocation = async (allocationbody) => {
  const { userId, arr } = allocationbody;
  // arr.forEach(async(e)=>{
  //   let  streetId = e
  //   const streets = await Street.findById(streetId)
  //   if(streets.AllocationStatus === "Allocated"){
  //     throw new ApiError(httpStatus.NOT_FOUND, "Street Already Allocated")
  //   }
  //    await Streets.updateOne({_id:streetId}, {AllocatedUser:userId, AllocationStatus:"Allocated"}, {new:true})
  // })
};

const getAllocatedStreeOnly = async () => {
  const street = await Streets.find({ AllocationStatus: 'Allocated' });
  return street;
};

const getAllDeAllocatedStreetOnly = async () => {
  const street = await Streets.find({ AllocationStatus: 'DeAllocated' });
  return street;
};

const getAllStreetById = async (id) => {
  return await Streets.aggregate([
    { $sort: { order: 1 } },
    {
      $match: {
        $and: [{ AllocatedUser: { $eq: id } }, { AllocationStatus: { $ne: 'DeAllocated' } }, { order: { $ne: null } }],
      },
    },
    {
      $project: {
        street: 1,
        order: 1,
      },
    },
  ]);
};

const getaggregationByUserId = async (AllocatedUser) => {
  return await Streets.aggregate([
    {
      $match: {
        $and: [{ AllocatedUser: { $eq: AllocatedUser }, AllocationStatus: { $ne: 'DeAllocated' } }],
      },
    },
    {
      $lookup: {
        from: 'manageusers',
        localField: 'AllocatedUser',
        foreignField: '_id',
        as: 'manageusersData',
      },
    },
    {
      $unwind: '$manageusersData',
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'wardId',
        foreignField: '_id',
        as: 'wardData',
      },
    },
    {
      $unwind: '$wardData',
    },
    {
      $lookup: {
        from: 'zones',
        localField: 'zone',
        foreignField: '_id',
        as: 'zonesData',
      },
    },
    {
      $unwind: '$zonesData',
    },
    {
      $lookup: {
        from: 'shops',
        let: { street: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$street', '$Strid'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
        ],
        as: 'shopData',
      },
    },
    {
      $lookup: {
        from: 'apartments',
        let: { street: '$_id' },

        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$$street', '$Strid'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
        ],
        as: 'apartmentData',
      },
    },
    {
      $project: {
        wardName: '$wardData.ward',
        id: 1,
        zoneName: '$zonesData.zone',
        street: 1,
        apartMent: '$apartmentData',
        closed: 1,
        shop: '$shopData',
        manageUserId: '$manageusersData._id',
      },
    },
  ]);
};

const getDeAllocationaggregationByUserId = async (AllocatedUser) => {
  // return await Streets.aggregate([
  //   {
  //     $match: {
  //       $and: [{ AllocatedUser: { $eq: AllocatedUser }, AllocationStatus:{$eq:"DeAllocated"} }],
  //     },
  //   },
  //   {
  //     $lookup:{
  //       from: 'wards',
  //       localField: 'wardId',
  //       foreignField: '_id',
  //       as: 'wardData',
  //     }
  //   },
  //   {
  //     $unwind:'$wardData'
  //   },
  //   {
  //     $lookup:{
  //       from: 'zones',
  //       localField: 'zone',
  //       foreignField: '_id',
  //       as: 'zonesData',
  //     }
  //   },
  //   {
  //     $unwind:'$zonesData'
  //   },
  //   {
  //     $lookup:{
  //       from: 'shops',
  //       let:{'street':'$_id'},

  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $eq: ["$$street", "$Strid"],  // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
  //             },
  //           },
  //         },
  //       ],
  //       as: 'shopData',
  //     }
  //   },
  //   {
  //     $lookup:{
  //       from: 'apartments',
  //       let:{'street':'$_id'},

  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $eq: ["$$street", "$Strid"],  // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
  //             },
  //           },
  //         },
  //       ],
  //       as: 'apartmentData',
  //     }
  //   },
  //   {
  //     $project: {
  //       wardName:'$wardData.ward',
  //       id:1,
  //       zoneName:'$zonesData.zone',
  //       street:1,
  //       apartMent:'$apartmentData',
  //       closed:1,
  //       shop:'$shopData'
  //     },
  //   },
  // ]);
  console.log(AllocatedUser);
};

const streetDeAllocation = async (allocationbody) => {
  const { userId, arr } = allocationbody;
  arr.forEach(async (e) => {
    let streetId = e;
    await Streets.updateOne({ _id: streetId }, { DeAllocatedUser: userId, AllocationStatus: 'DeAllocated' }, { new: true });
  });
  return `Street DeAllocated SuccessFully`;
};

const getWardByStreet = async (wardId, status) => {
  const ress = await Street.aggregate([
    {
      $match: {
        $and: [{ wardId: { $eq: wardId }, AllocationStatus: { $eq:  status}}],
      },
    },
  ]);
  console.log('Total Street Find : ' + ress.length);
  return ress;
};

const getAllStreet = async () => {
  return Street.aggregate([
    {
      $lookup: {
        from: 'zones',
        localField: 'zone',
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
      $lookup: {
        from: 'wards',
        localField: 'wardId',
        foreignField: '_id',
        as: 'wardData',
      },
    },
    {
      $unwind: '$wardData',
    },
    {
      $project: {
        districtName: '$districtData.district',
        zoneName: '$zoneData.zone',
        // district:"$districtData.district",
        // zoneId:"$zoneData._id",
        wardNo: '$wardData.wardNo',
        zoneCode: '$zoneData.zoneCode',
        wardName: '$wardData.ward',
        street: 1,
        _id: 1,
      },
    },
    { $limit: 10 },
  ]);
};

// pagination with Aggregation

const streetPagination = async (id) => {
  console.log(id);
  return Street.aggregate([
    {
      $sort: { locality: 1 },
    },
    {
      $lookup: {
        from: 'zones',
        localField: 'zone',
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
      $lookup: {
        from: 'wards',
        localField: 'wardId',
        foreignField: '_id',
        as: 'wardData',
      },
    },
    {
      $unwind: '$wardData',
    },
    {
      $project: {
        districtName: '$districtData.district',
        zoneName: '$zoneData.zone',
        // district:"$districtData.district",
        // zoneId:"$zoneData._id",
        wardNo: '$wardData.wardNo',
        zoneCode: '$zoneData.zoneCode',
        wardName: '$wardData.ward',
        locality: 1,
        area: 1,
        street: 1,
        _id: 1,
      },
    },
    { $skip: 20 * id },
    { $limit: 20 },
  ]);
};

const getStreetByWardId = async (wardId) => {
  console.log(wardId);
  const street = await Street.find({ wardId });
  if (!street === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WardId Is Incorrect');
  }
  return street;
};

const queryStreet = async (filter, options) => {
  return Street.paginate(filter, options);
};

const updateStreetById = async (streetId, updateBody) => {
  console.log(streetId);
  let street = await getStreetById(streetId);
  if (!street) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Street not found');
  }
  console.log(street);
  street = await Street.findByIdAndUpdate({ _id: streetId }, updateBody, { new: true });
  return street;
};

const closedStatus = async (streetId, updatebody) => {
  let street = await getStreetById(streetId);
  if (!street) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Street Not Found');
  }
  street = await Street.findByIdAndUpdate({ _id: streetId }, updatebody, { new: true });
  return street;
};

const deleteStreetById = async (streetId) => {
  console.log(streetId);
  const street = await getStreetById(streetId);
  if (!street) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Street not found');
  }
  (street.active = false), (street.archive = true), await street.save();
  return street;
};
module.exports = {
  createStreet,
  getStreetById,
  getAllStreet,
  streetPagination,
  getDeAllocationaggregationByUserId,
  getWardByStreet,
  getAllocatedStreeOnly,
  getAllDeAllocatedStreetOnly,
  getStreetByWardId,
  getaggregationByUserId,
  updateStreetById,
  streetAllocation,
  closedStatus,
  deleteStreetById,
  streetDeAllocation,
  queryStreet,
  getAllStreetById,
};
