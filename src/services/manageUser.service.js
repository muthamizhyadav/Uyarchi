const httpStatus = require('http-status');
const { ManageUser } = require('../models');
const ApiError = require('../utils/ApiError');

const createManageUser = async (manageUserBody) => {
    const check = await ManageUser.find({mobileNumber:manageUserBody.mobileNumber})
    console.log(check);
    if(check != ""){
      throw new ApiError(httpStatus.NOT_FOUND, 'already register the number');
    }
    return ManageUser.create(manageUserBody);
  };
  
  const getManageUserById = async (id) => {
    
    return ManageUser.aggregate([
      {
        $match: {
          $and:[{ _id: { $eq: id }}],
        },
      },
      {
        $lookup:{
          from: 'zones',
          localField: 'preferredZone',
          foreignField: '_id',
          as: 'zonesdata',
        }
      },
      {
        $unwind:'$zonesdata'
      },
      {
        $lookup:{
          from: 'wards',
          localField: 'preferredWard',
          foreignField: '_id',
          as: 'wardsdata',
        }
      },
      {
        $unwind:'$wardsdata'
      },
      {
        $lookup:{
          from: 'districts',
          localField: 'preferredDistrict',
          foreignField: '_id',
          as: 'districtsdata',
        }
      },
      {
        $unwind:'$districtsdata'
      },
      {
        $project: {
          name:1,
          mobileNumber:1,
          preferredZone:'$zonesdata.zone',
          preferredWard:'$wardsdata.ward',
          created:1,
          addressProofUpload:1,
          idProofUpload:1,
          twoWheelerUpload:1,
          _id:1,
          preferredDistrict:'$districtsdata.district',
          active:1,
          archive:1,
          dateOfBirth:1,
          gender:1,
          educationQualification:1,
          mobileNumber1:1,
          whatsappNumber:1,
          address:1,
          pincode:1,
          phoneModel:1,
          idProofNo:1,
          addressProofNo:1,
          twoWheeler:1,
          BasetwoWheelerUpload:1,
          BaseaddressProofUpload:1,
          BaseidProofUpload:1,
          preferredWardId:'$wardsdata._id',
          preferredZoneId:'$zonesdata._id',
          preferredDistrictId:'$districtsdata._id',
        },
      },

    ]);
  };

  const getManageUserdataById = async (id) => {
    return ManageUser.findById(id);
  
  }


  const loginManageUserEmailAndPassword = async (mobileNumber,dateOfBirth) => {
    const interviewerRegistration = await ManageUser.find({mobileNumber:mobileNumber});
    console.log(interviewerRegistration[0].dateOfBirth)
  let dob=interviewerRegistration[0].dateOfBirth.replace(/[^0-9\.]+/g, "")
  if(interviewerRegistration !=""){
    if(dob==dateOfBirth){
    }
    else{
      throw new ApiError(httpStatus.NOT_FOUND, 'DOB Not Match');
    }
  }
  else{
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Number Not Registored');
  }

    return interviewerRegistration;
  };

  const ManageUserAll = async ()=>{
    const Manage = await ManageUser.find({active:true})
    if(!Manage){
        throw new ApiError(httpStatus.NOT_FOUND, 'Manage not found');
    }
    return Manage;
}

const ManageUserAllenable = async ()=>{
  const Manage = await ManageUser.find()
  return Manage;
}

const manageUserAllTable = async (id,districtId,zoneId,wardId,page) =>{
    let match;
    if(id !='null'&&districtId !='null'&&zoneId !='null'&&wardId!='null'){
       match=[{ _id: { $eq: id }},{ preferredDistrict: { $eq: districtId }},{ preferredZone:{$eq:zoneId}},{ preferredWard:{$eq:wardId}}]
    }
    else if(id !='null'&&districtId =='null'&&zoneId =='null'&&wardId =='null'){
       match=[{ _id: { $eq: id }}]
    }
    else if(id =='null'&&districtId !='null'&&zoneId =='null'&& wardId =='null'){
       match=[{ preferredDistrict: { $eq: districtId }}]
    }
    else if(id =='null'&&districtId =='null'&zoneId !='null'&& wardId =='null'){
       match=[{ preferredZone:{ $eq: zoneId }}]
    }
    else if(id =='null'&&districtId =='null'&zoneId =='null'&& wardId !='null'){
      match=[{ preferredWard:{ $eq: wardId }}]
    }
    else if(id =='null'&&districtId !='null'&&zoneId !='null'&& wardId != 'null'){
       match=[{ preferredDistrict: { $eq: districtId }},{ preferredZone:{ $eq: zoneId}},{ preferredWard:{ $eq: wardId}}]
    }
    else if(id !='null'&&districtId =='null'&&zoneId !='null'&& wardId!='null'){
       match=[{ _id: { $eq: id }},{ preferredZone:{ $eq:zoneId}},{ preferredWard:{ $eq: wardId}}]
    }
    else if(id !='null'&&districtId !='null'&&zoneId =='null'&&wardId == 'null'){
       match=[{ _id: { $eq: id }},{ preferredDistrict: { $eq: districtId }}]
    }
    else if(id =='null'&&districtId !='null'&&zoneId !='null'&& wardId=='null'){
      match=[{ preferredDistrict: { $eq: districtId }},{ preferredZone:{ $eq: zoneId}}]
    }
    else if(id =='null'&&districtId =='null'&&zoneId !='null'&& wardId!='null'){
      match=[{ preferredZone:{ $eq: zoneId}},{ preferredWard:{ $eq: wardId}}]
    }
    else if(id !='null'&&districtId =='null'&&zoneId =='null'&& wardId!='null'){
      match=[{ _id: { $eq: id }},{ preferredWard:{ $eq: wardId}}]
    
    }else if(id !='null'&&districtId =='null'&&zoneId !='null'&& wardId=='null'){
      match=[{ _id: { $eq: id }},{ preferredZone:{ $eq: zoneId}}]
    }else if(id !='null'&&districtId !='null'&&zoneId !='null'&& wardId=='null'){
      match=[{ _id: { $eq: id }},{ preferredDistrict: { $eq: districtId }},{ preferredZone:{ $eq: zoneId}}]
    }
    else{
      match=[{ _id: { $ne: null }}]
    }
    const user = await ManageUser.aggregate([
      {
        $match: {
          $and: match,
        },
      },
      {
        $lookup:{
          from: 'zones',
          localField: 'preferredZone',
          foreignField: '_id',
          as: 'zonesdata',
        }
      },
      {
        $unwind:'$zonesdata'
      },
      {
        $lookup:{
          from: 'wards',
          localField: 'preferredWard',
          foreignField: '_id',
          as: 'wardsdata',
        }
      },
      {
        $unwind:'$wardsdata'
      },
      {
        $lookup:{
          from: 'districts',
          localField: 'preferredDistrict',
          foreignField: '_id',
          as: 'districtsdata',
        }
      },
      {
        $unwind:'$districtsdata'
      },
      {
        $project: {
          name:1,
          mobileNumber:1,
          preferredZone:'$zonesdata.zone',
          preferredWard:'$wardsdata.ward',
          created:1,
          addressProofUpload:1,
          idProofUpload:1,
          twoWheelerUpload:1,
          _id:1,
          preferredDistrict:'$districtsdata.district',
          active:1,
          archive:1,
          BasetwoWheelerUpload:1,
          BaseaddressProofUpload:1,
          BaseidProofUpload:1,
          preferredWardId:'$wardsdata._id'
  
        },
      },
      {
        $skip:10*page
      },
     {
        $limit:10
      },

    ])
    console.log(user.length)
    const count=await ManageUser.aggregate([
      {
        $match: {
          $and: match,
        },
      },
    ]);
  
    return {
      data:user,
      count:count.length
    }

  }   
  
  const updateManageUserId = async (manageUserId, updateBody) => {
    let Manage = await getManageUserById(manageUserId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ManageUser not found');
    }
    Manage = await ManageUser.findByIdAndUpdate({ _id: manageUserId }, updateBody, { new: true });
    return Manage;
  };
  
  const deleteManageUserById = async (manageUserId) => {
    const Manage = await getManageUserdataById(manageUserId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ManageUser not found');
    }
    (Manage.active = false), (Manage.archive = true), await Manage.save();
    return Manage;
  };
  
  module.exports = {
      createManageUser,
      getManageUserById,
      ManageUserAll,
      updateManageUserId,
      deleteManageUserById,
      loginManageUserEmailAndPassword,
      manageUserAllTable,
      ManageUserAllenable
  };
  