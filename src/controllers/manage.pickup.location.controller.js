const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const ManagePickupService = require('../services/manage.pickup.location.service');

const createManagePickupLocation = catchAsync(async (req, res) => {
  const pickuplocation = await ManagePickupService.createManagePickupLocation(req.body);
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      pickuplocation.photoCapture.push('images/pickup/' + files.filename);
    });
  }
  res.send(pickuplocation);
  await pickuplocation.save();
});

const getAllManagepickup = catchAsync(async (req, res) => {
  let userId = req.userId;
  const pickuplocation = await ManagePickupService.getAllManagepickup(req.params.page, userId);
  res.send(pickuplocation);
});

const getManagePickupById = catchAsync(async (req, res) => {
  const pickuplocation = await ManagePickupService.getManagePickupById(req.params.id);
  res.send(pickuplocation);
});

module.exports = {
  createManagePickupLocation,
  getAllManagepickup,
  getManagePickupById,
};
