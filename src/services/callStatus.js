const httpStatus = require('http-status');
const { CallStatus } = require('../models');
const ApiError = require('../utils/ApiError');

const createCallStatus = async (callStatusBody) => {
  return CallStatus.create(callStatusBody);
};

const getCallStatusById = async (id) => {
  return CallStatus.findById(id);
};

const updateCallStatusById = async (id, updateBody) => {
  let callstatus = await getCallStatusById(id);
  if (!callstatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CallStatus  not found');
  }
  callstatus = await CallStatus.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return callstatus;
};

const deleteCallStatusById = async (id) => {
  const callstatus = await getCallStatusById(id);
  if (!callstatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business_Details not found');
  }
  (callstatus.archive = true), (callstatus.active = false), await callstatus.save();
  return callstatus;
};

module.exports = {
  createCallStatus,
  getCallStatusById,
  updateCallStatusById,
  deleteCallStatusById,
};
