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

const getAllpackTypeAll = async (unit,page) => {
    console.log(unit)
    let match
    if(unit == 'null'){
      match =  [{active:{eq:true}}]
    }else{
        match = [{unit:{$eq:unit}}]
    }
  const data = await packType.aggregate([
    {
        $match: {
          $and: match,
        },
      },
      {
        $skip:10*parseInt(page)
      },
     {
        $limit:10
      },

  ]);
  const count = await packType.aggregate([
    {
        $match: {
          $and: match,
        },
      },
      {
        $skip:10*parseInt(page)
      },
     {
        $limit:10
      },

  ]);
  return {data:data, total:count.length}
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