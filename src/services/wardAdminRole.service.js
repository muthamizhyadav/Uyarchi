const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const  wardAdminRole = require('../models/wardAdminRole.model');
const moment = require('moment');

const createwardAdminRole = async (body) => {
    let serverdate = moment().format('DD-MM-yyy');
    let time = moment().format('hh:mm a')
    let values = {}
    values = { ...body, ...{ date:serverdate, time:time} };
  const data = await wardAdminRole.create(values);
  return data;
};


const getAll = async () => {
  return wardAdminRole.find({ active: true });
};

const getWardAdminRoleById = async (id) => {
  const data = await wardAdminRole.findById(id);
  if (!data || data.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wardAdminRole Not Found');
  }
  return data;
};

// const updateTrendsById = async (trendsId, updateBody) => {
//   let trends = await getTrendsById(trendsId);
//   if (!trends) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Trends not found');
//   }
//   console.log(trends);

//   trends = await Trends.findByIdAndUpdate({ _id: trendsId }, updateBody, { new: true });
//   return trends;
// };

// const deleteTrendsById = async (trendsId) => {
//   const trends = await getTrendsById(trendsId);
//   if (!trends) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Trends not found');
//   }
//   (trends.active = false), (trends.archive = true), await trends.save();
//   return trends;
// };


module.exports = {
  createwardAdminRole,
  getAll,
  getWardAdminRoleById,
//   updateProductFromTrends,
//   updateTrendsById,
//   deleteTrendsById,
};