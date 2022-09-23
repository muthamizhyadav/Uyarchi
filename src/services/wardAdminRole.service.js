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
  return WardAdminRole.find({ active: true });
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
      $project: {
        salesmanName: '$wardadminroleasmsData.salesman',
        targetValue: '$wardadminroleasmsData.targetValue',
        targetTonne:'$wardadminroleasmsData.targetTonne',
        wardAdminId:'$wardadminroleasmsData.wardAdminId',
        userRoleId:'$wardadminroleasmsData.userRoleId',
        b2buserId: '$wardadminroleasmsData.b2buserId',
        date:'$wardadminroleasmsData.date',
        time:'$wardadminroleasmsData.time',
        roleName: 1,
        Asm:1,
        _id: 1,
      },
    },
  ])
  return data ;
}


module.exports = {
  createwardAdminRole,
  getAll,
  getWardAdminRoleById,
  createwardAdminRoleAsm,  
  getAllWardAdminRoleData,
  smData,
}