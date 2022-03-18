const httpStatus = require('http-status');
const { Street } = require('../models');
const ApiError = require('../utils/ApiError');

const createStreet = async (streetBody) => {
    return Street.create(streetBody);
  };
  
  const getStreetById = async (id) => {
    const street=Street.findById(id);
        return street
  };
  
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
    updateStreetById,
    deleteStreetById,
    queryStreet,
  };
  