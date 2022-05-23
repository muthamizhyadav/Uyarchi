const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const CallStatusService = require('../services/callStatus');

const createCallStatus = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.createCallStatus(req.body);
  if (!callStatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CallStatus Not Fount.');
  }
  res.status(httpStatus.CREATED).send(callStatus);
});


const getCallStatusbyId = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.getCallStatusById(req.params.id)
  if (!callStatus || !callStatus.active === true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Call Status Not Found');
  }
  res.send(callStatus);
});

const updateCallStatusById = catchAsync(async (req, res) => {
  const callStatus = await CallStatusService.updateCallStatusById(req.params.id, req.body)
  res.send(callStatus);
});

const deleteBusinessById = catchAsync(async (req, res) => {
  await CallStatusService.deleteCallStatusById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createCallStatus,
    getCallStatusbyId,
    updateCallStatusById,
    deleteBusinessById,
};
