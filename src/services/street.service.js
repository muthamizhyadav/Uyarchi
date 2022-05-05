const httpStatus = require('http-status');
const { Street } = require('../models');
const ApiError = require('../utils/ApiError');
const Ward = require('../models/ward.model')

const createStreet = async (streetBody) => {
  const { wardId } = streetBody
  let war = await Ward.findById(wardId)
  let values = {}
  values = {...streetBody, ...{ward:war.ward}}
  if(war === null){
    throw new ApiError(httpStatus.NO_CONTENT, "!oops")
  }
    return Street.create(values)
  };
  
  const getStreetById = async (id) => {
    const street=Street.findById(id);
      return street
  };
  
const getAllStreet = async ()=>{
  return Street.aggregate([{
     
    $lookup: {
        from: "zones",
        localField: "zone",
        foreignField: "_id",
        as: "zoneData"
    }
},
{
    $unwind: "$zoneData"
},
{
    $lookup: {
        from: "districts",
        localField: "district",
        foreignField: "_id",
        as: "districtData"
    }
},
{
  $unwind: "$districtData"
},
{
  $lookup:{
    from:"wards",
    localField: "wardId",
    foreignField:"_id",
    as:"wardData"
  },
},
{
  $unwind:"$wardData"
},
{
  $project:{
    districtName:"$districtData.district",
    zoneName:"$zoneData.zone",
    // district:"$districtData.district",
    // zoneId:"$zoneData._id",
    wardNo:"$wardData.wardNo",
    zoneCode:"$zoneData.zoneCode",
    wardName:"$wardData.ward",
    street:1,
    _id:1
  }
},
{$limit : 10},
])
}



const getStreetByWardId = async(wardId)=>{
  console.log(wardId)
  const street = await Street.find({wardId})
  if(!street === null){
    throw new ApiError(httpStatus.NOT_FOUND, "WardId Is Incorrect")
  }
  return street
}

  const queryStreet = async (filter, options) => {
    return Street.paginate(filter, options);
  };
  
  const updateStreetById = async (streetId, updateBody) => {
    console.log(streetId);
    let  street = await getStreetById(streetId);
    if (!street) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Street not found');
    }
    console.log(street)
    street = await Street.findByIdAndUpdate({ _id: streetId }, updateBody, { new: true });
    return street;
  };
  const deleteStreetById = async (streetId) => {
    console.log(streetId)
    const street = await getStreetById(streetId);
    if (!street) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Street not found');
    }
    street.active = false,
   street.archive = true,
    await street.save() 
    return street;
  };
  module.exports = {
    createStreet,
    getStreetById,
    getAllStreet,
    getStreetByWardId,
    updateStreetById,
    deleteStreetById,
    queryStreet,
  };
  