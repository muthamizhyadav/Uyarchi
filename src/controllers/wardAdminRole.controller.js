const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminRoleService = require('../services/wardAdminRole.service');


const createwardAdminRoleService = catchAsync(async (req, res) => {
    const data = await wardAdminRoleService.createwardAdminRole(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const getAllwardAdminRole = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getAll(req.params.date);
  res.send(data);
});

const getDataById = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getWardAdminRoleById(req.params.id);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wardAdminRole Not Found');
  }
  res.send(data);
});


const createwardAdminRoleAsmService = catchAsync(async (req, res) => {
    const data = await wardAdminRoleService.createwardAdminRoleAsm(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const getAllWardAdminRoleData = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getAllWardAdminRoleData(req.params.id);
  if (!data || data.active == false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wardAdminRole Not Found');
  }
  res.send(data);
});

const  smData = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.smData(req.params.date);
  res.send(data);
});


const total = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.total(req.params.id, req.body);
   res.send(data);
});

const createAsmSalesman = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.createAsmSalesman(req.body);
  res.send(data);
});

const allAsmSalesmanData = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getAsmSalesman(req.params.id);
   res.send(data);
});

const getAllAssignReassignData = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.allAssignReassignSalesman(req.params.id);
   res.send(data);
});


const createSalesmanShop = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.createSalesmanShop(req.body);
   res.send(data);
});

const getAllAssignSalesmanShopData = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getSalesman(req.params.id);
   res.send(data);
});

module.exports = {
    getDataById,
    getAllwardAdminRole,
    createwardAdminRoleService,
    createwardAdminRoleAsmService,
    getAllWardAdminRoleData,
    smData,
    total,
    createAsmSalesman,
    allAsmSalesmanData,
    getAllAssignReassignData,
    createSalesmanShop,
    getAllAssignSalesmanShopData,
};