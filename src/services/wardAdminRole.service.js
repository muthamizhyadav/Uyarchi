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

// const salesmannotAllocateData = async () =>{
//   let data = await 
// }


module.exports = {
  createwardAdminRole,
  getAll,
  getWardAdminRoleById,
  createwardAdminRoleAsm,  
  getAllWardAdminRoleData,
}