const httpStatus = require('http-status');
const { Street, Status } = require('../models');
const ApiError = require('../utils/ApiError');

const createStatus = async (streetBody) => {
  return Status.create(streetBody);
};

const getStreetById = async (statusId) => {
  const status = await Status.findById(statusId);
  return status;
};

const updatestatusById = async (statusId, updateBody) => {
  let status = await Status.findById(statusId);
  if (!status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  status = await Status.findByIdAndUpdate({ _id: statusId }, updateBody, { new: true });
  return status;
};

const deletestatusById = async (statusId) => {
  const status = await getSupplierById(statusId);
  if (!status) {
    throw new ApiError(httpStatus.NOT_FOUND, 'status not found');
  }
  (status.active = false), (status.archive = true), await status.save();
  return status;
};

module.exports = {
  createStatus,
  getStreetById,
  deletestatusById,
  updatestatusById,
};
