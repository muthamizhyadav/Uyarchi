const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const packType =  require('../models/packType.model')



const createpackTypeData = async (packTypeBody) => {

  return packType.create(packTypeBody);

};

const getpackTypeById = async (packTypeId) => {
    return packType.findById(packTypeId);
  };

const getAllpackTypeAll = async () => {
  const data = await packType.find({active:'true'});
  return {data:data, total:data.length}
}

const updatepackTypeId = async (packTypeId, updateBody) => {
    let Manage = await getpackTypeById(packTypeId);

    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'paymentData not found');
    }
    Manage = await packType.findByIdAndUpdate({ _id: packTypeId }, updateBody, { new: true });
    return Manage;
  };
  
  const deletePackTypeById = async (packTypeId) => {
    const Manage = await getpackTypeById(packTypeId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'paymentData not found');
    }
    (Manage.active = false), (Manage.archive = true), await Manage.save();
    return Manage;
  };

  module.exports = { createpackTypeData,getpackTypeById, getAllpackTypeAll, updatepackTypeId, deletePackTypeById };