const httpStatus = require('http-status');
const { Street } = require('../models');
const ApiError = require('../utils/ApiError');
const Ward = require('../models/ward.model')

const createStreet = async (streetBody) => {
  const { wardId } = streetBody
  let war = await Ward.findById(wardId)
  console.log(war)
  let values = {}
  values = {...streetBody, ...{ward:war.ward}}
  if(war === null){
    throw new ApiError(httpStatus.NO_CONTENT, "!oops")
  }
    return Street.create(values);
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
  