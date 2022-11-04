const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const BugToolAdminService = require('../services/BugToolAdmin.service');

const createBugToolAdminService = catchAsync(async (req, res) => {
  const data = await BugToolAdminService.createAdminAddUser(req.body);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data Not Fount.');
  }
  res.status(httpStatus.CREATED).send(data);
});

const getAll = catchAsync(async (req, res) => {
  const data = await BugToolAdminService.getAll();  
  res.send(data);
});

const updateByProjectId = catchAsync(async (req, res) => {
  const data = await BugToolAdminService.updateByProjectId(req.params.id, req.body);
  res.send(data);
});

const deleteUserById = catchAsync(async (req, res) => {
  await BugToolAdminService.deleteUserById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const createAdminAddproject = catchAsync(async (req, res) => {
  const data = await BugToolAdminService.createAdminAddproject(req.body);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data Not Fount.');
  }
  res.status(httpStatus.CREATED).send(data);
});

const getAllProject = catchAsync(async (req, res) => {
  const data = await BugToolAdminService.getAllProject();  
  res.send(data);
});

const updateByUserId = catchAsync(async (req, res) => {
  const data = await BugToolAdminService.updateByUserId(req.params.id, req.body);
  res.send(data);
});

const deleteProjectById = catchAsync(async (req, res) => {
  await BugToolAdminService.deleteProjectById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createBugToolAdminService,
    getAll,
    getAllProject,
    createAdminAddproject,
    updateByUserId,
    updateByProjectId,
    deleteUserById,
    deleteProjectById,

};