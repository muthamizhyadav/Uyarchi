const httpStatus = require('http-status');
const { Apartment, Shop} = require('../models/apartmentTable.model');
const manageUser = require('../models/manageUser.model')
const ApiError = require('../utils/ApiError');

const createApartment = async (apartmentBody) => {
    const {manageUserId} = apartmentBody;
    
    let ManageUser = await manageUser.findById(manageUserId);
    let values = {}
    values = {...apartmentBody, ...{manageUserId:ManageUser.id}}
    if(ManageUser === null){
      throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
    }
    console.log(values)
    return Apartment.create(values)
};

const createShop = async (shopBody) => {
    const {manageUserId} = shopBody;
    
    let ManageUser = await manageUser.findById(manageUserId);
    let values = {}
    values = {...shopBody, ...{manageUserId:ManageUser.id}}
    if(ManageUser === null){
      throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
    }
    console.log(values)
    return Shop.create(values)
  };
  

const getShopById = async (id) => {
  return Shop.findById(id);
};

const getApartmentById = async (id) => {
    return Apartment.findById(id);
  };

const getAllApartment = async () => {
  return Apartment.find();
};


const getAllShop = async () => {
    return Shop.find();
  };


const updateApartmentById = async (apartmentId, updateBody) => {
  let Apart = await getAssignById(apartmentId);
  if (!Apart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Apartment not found');
  }
  Apart = await Apartment.findByIdAndUpdate({ _id: apartmentId }, updateBody, { new: true });
  return Apart;
};

const updateShopById = async (shopId, updateBody) => {
    let Sho = await getShopById(shopId);
    if (!Sho) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
    }
    Sho = await Apartment.findByIdAndUpdate({ _id: shopId }, updateBody, { new: true });
    return Sho;
  };

const deleteapartmentById = async (apartmentId) => {
    const Apart = await getApartmentById(apartmentId);
    if (!Apart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Apartment not found');
    }
    (Apart.archive = true), (Apart.active = false), await Apart.save();
    return Apart;
  };

  const deleteShopById = async (shopId) => {
    const Sho = await getApartmentById(shopId);
    if (!Sho) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
    }
    (Sho.archive = true), (Sho.active = false), await Sho.save();
    return Sho;
  };

module.exports = {
    createApartment,
    createShop,
    getShopById,
    getApartmentById,
    getAllApartment,
    getAllShop,
  updateApartmentById,
  updateShopById,
  deleteapartmentById,
  deleteShopById,
};
