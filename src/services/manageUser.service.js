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
    const  Manage = ManageUser.findById(id);
    if (!Manage || Manage.active === false) {
      throw new ApiError(httpStatus.NOT_FOUND, ' ManageUser Not Found');
    }
    return  Manage;
  };

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

const manageUserAllTable = async (id,districtId,zoneId,wardId,page) =>{
    let match;
    if(id !='null'&&districtId !='null'&&zoneId !='null'&&wardId!='null'){
       match=[{ _id: { $eq: id }},{ preferredDistrict: { $eq: districtId }},{ preferredZone:{$eq:zoneId}},{ preferredWard:{$eq:wardId}},{active:{$eq:true}}]
    }
    else if(id !='null'&&districtId =='null'&&zoneId =='null'&&wardId =='null'){
       match=[{ _id: { $eq: id }},{active:{$eq:true}}]
    }
    else if(id =='null'&&districtId !='null'&&zoneId =='null'&& wardId =='null'){
       match=[{ preferredDistrict: { $eq: districtId }},{active:{$eq:true}}]
    }
    else if(id =='null'&&districtId =='null'&zoneId !='null'&& wardId =='null'){
       match=[{ preferredZone:{ $eq: zoneId }},{active:{$eq:true}}]
    }
    else if(id =='null'&&districtId =='null'&zoneId !='null'&& wardId =='null'){
      match=[{ preferredWard:{ $eq: wardId }},{active:{$eq:true}}]
    }
    else if(id =='null'&&districtId !='null'&&zoneId !='null'&& wardId != 'null'){
       match=[{ preferredDistrict: { $eq: districtId }},{ preferredZone:{ $eq: zoneId}},{ preferredWard:{ $eq: wardId}},{active:{$eq:true}}]
    }
    else if(id !='null'&&districtId =='null'&&zoneId !='null'&& wardId!='null'){
       match=[{ _id: { $eq: id }},{ preferredZone:{ $eq:zoneId}},{ preferredWard:{ $eq: wardId}},{active:{$eq:true}}]
    }
    else if(id !='null'&&districtId !='null'&&zoneId =='null'&&wardId == 'null'){
       match=[{ _id: { $eq: id }},{ preferredDistrict: { $eq: districtId }},{active:{$eq:true}}]
    }
    else if(id =='null'&&districtId !='null'&&zoneId !='null'&& wardId=='null'){
      match=[{ preferredDistrict: { $eq: districtId }},{ preferredZone:{ $eq: zoneId}},{active:{$eq:true}}]
    }
    else if(id =='null'&&districtId =='null'&&zoneId !='null'&& wardId!='null'){
      match=[{ preferredZone:{ $eq: zoneId}},{ preferredWard:{ $eq: wardId}},{active:{$eq:true}}]
    }
    else if(id !='null'&&districtId =='null'&&zoneId =='null'&& wardId!='null'){
      match=[{ _id: { $eq: id }},{ preferredWard:{ $eq: wardId}},{active:{$eq:true}}]
    
    }else if(id !='null'&&districtId =='null'&&zoneId !='null'&& wardId=='null'){
      match=[{ _id: { $eq: id }},{ preferredZone:{ $eq: zoneId}},{active:{$eq:true}}]
    }else if(id !='null'&&districtId !='null'&&zoneId !='null'&& wardId=='null'){
      match=[{ _id: { $eq: id }},{ preferredDistrict: { $eq: districtId }},{ preferredZone:{ $eq: zoneId}},{active:{$eq:true}}]
    }
    else{
      match=[{ _id: { $ne: null }},{active:{$eq:true}}]
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
  
        },
      },
      {
        $skip:10*parseInt(page)
      },
     {
        $limit:10
      },
    ])
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
    const Manage = await getManageUserById(manageUserId);
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
  };
  