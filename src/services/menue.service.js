const httpStatus = require('http-status');
const { Menues } = require('../models');
const ApiError = require('../utils/ApiError');
const scvPurchase = require('../models/scv.Purchase.model');

const createMenues = async (menueBody) => {
  return Menues.create(menueBody);
};

const getMenuesById = async (id) => {
  return Menues.findById(id);
};

const getAllMenues = async () => {
  return Menues.find();
};


const updateMenuesById = async (menueId, updateBody) => {
  let menue = await getMenuesById(menueId);
  if (!menue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Menues not found');
  }
  menue = await Menues.findByIdAndUpdate({ _id: menueId }, updateBody, { new: true });
  return menue;
};

const deleteMenueById = async (menueId) => {
  const menue = await getMenuesById(menueId);
  if (menue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Menues not found');
  }
  return menue;
};

module.exports = {
    createMenues,
    getAllMenues,
    getMenuesById,
    updateMenuesById,
    deleteMenueById,
};
