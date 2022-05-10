const httpStatus = require('http-status');
const { ManageBusinessUser } = require('../models');
const ApiError = require('../utils/ApiError');

const createBusinessUsers = async (BUsersbody) => {
  return ManageBusinessUser.create(BUsersbody);
};

const getBusinessUsersById = async (BUId) => {
  const Busers = await ManageBusinessUser.findById(BUId);
  if (!Busers) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business Users Not Found');
  }
  return Busers;
};

const getAllBusinessUsers = async () => {
  const Mbusers = await ManageBusinessUser.find();
  console.log(Mbusers)
  return Mbusers
};

const updateBusinessUsers = async (BUId, updateBody) => {
  const busers = await getBusinessUsersById(BUId);
  if (!busers) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business Users Not Found');
  }

  busers = await ManageBusinessUser.findOneAndUpdate({ _id: BUId }, updateBody, { new: true });
  await busers.save();
  return busers;
};

const deleteBusinessUsers = async (BUId) => {
  const busers = await getBusinessUsersById(BUId);
  if (!busers) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business Users Not Found');
  }
  (busers.active = false), (busers.archive = true);
  await busers.save();
  return busers;
};

module.exports = {
    createBusinessUsers,
    getBusinessUsersById,
    getAllBusinessUsers,
    updateBusinessUsers,
    deleteBusinessUsers,
}
