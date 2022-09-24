const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const  {WardAdminRole, WardAdminRoleAsm} = require('../models/wardAdminRole.model');
const moment = require('moment');

const createwardAdminRole = async (body) => {
    let serverdate = moment().format('DD-MM-yyy');
    let time = moment().format('hh:mm a')
    let values = {}
    values = { ...body, ...{ date:serverdate, time:time} };
  const data = await WardAdminRole.create(values);
  return data;
};


const getAll = async () => {
  const data = await WardAdminRole.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: 'b2bUserId',
        foreignField: '_id',
        as: 'Asmb2busersData',
      },
    },
    {
      $unwind: '$Asmb2busersData',
    },
    {
      $project:{
        name:'$Asmb2busersData.name',
        targetTonne:1,
        targetValue:1,
        b2bUserId:1,
        date:1,
        time:1,
        _id:1,
      }
    }
  ])
  return data;
};

const getWardAdminRoleById = async (id) => {
  const data = await WardAdminRole.findById(id);
  if (!data || data.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wardAdminRole Not Found');
  }
  return data;
};

const createwardAdminRoleAsm = async (body) => {
    let serverdate = moment().format('DD-MM-yyy');
    let time = moment().format('hh:mm a')
    let values = {}
     values = { ...body, ...{ date:serverdate, time:time} };
     const data = await WardAdminRoleAsm.create(values);
     return data;
};

const getAllWardAdminRoleData = async (id) =>{
    let data = await WardAdminRole.aggregate([
      {
        $match: {
          $and: [{_id: { $eq: id } }],
        },
      },

    ])
    return data ;
}

const smData = async () =>{
  let data = await WardAdminRole.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: 'b2bUserId',
        foreignField: '_id',
        as: 'Asmb2busersData',
      },
    },
    {
      $unwind: '$Asmb2busersData',
    },
    {
      $lookup: {
        from: 'wardadminroleasms',
        localField: '_id',
        foreignField: 'wardAdminId',
        as: 'wardadminroleasmsData',
      },
    },
    {
      $unwind: '$wardadminroleasmsData',
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'wardadminroleasmsData.salesman',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        salesmanName: '$b2busersData.name',
        targetValue: '$wardadminroleasmsData.targetValue',
        targetTonne:'$wardadminroleasmsData.targetTonne',
        // wardAdminId:'$wardadminroleasmsData.wardAdminId',
        b2buserId: '$wardadminroleasmsData.salesman',
        date:'$wardadminroleasmsData.date',
        time:'$wardadminroleasmsData.time',
        Asm:'$Asmb2busersData.name',
        _id: 1,
      },
    },
  ])
  return data ;
}

const total = async (id, updateBody) => {
  let data = await getWardAdminRoleById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WardAdminRole not found');
  }
  let value =  updateBody.targetValue;
  let tone  = updateBody.targetTonne;
  let asmvalue = data.targetValue;
  let asmtone = data.targetTonne;
  let value1 = asmvalue - value ;
  let tone1 = asmtone - tone ;


  data = await WardAdminRole.findByIdAndUpdate({ _id: id }, {targetValue: value1, targetTonne: tone1}, { new: true });
  return data;
};

module.exports = {
  createwardAdminRole,
  getAll,
  getWardAdminRoleById,
  createwardAdminRoleAsm,  
  getAllWardAdminRoleData,
  smData,
  total,
  
}