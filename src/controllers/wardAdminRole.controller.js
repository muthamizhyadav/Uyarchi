const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const wardAdminRoleService = require('../services/wardAdminRole.service');

const createwardAdminRoleService = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.createwardAdminRole(req.body);
  res.send(data);
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

const smData = catchAsync(async (req, res) => {
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

// getAllSalesMandataCurrentdate
const getAllSalesMandataCurrentdate = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getAllSalesMandataCurrentdate(req.params.id);
  res.send(data);
});

// createwithoutoutAsmSalesman

const createwithoutoutAsmSalesman = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.createwithoutoutAsmSalesman(req.body);
  res.status(httpStatus.CREATED).send(data);
});

const withoutoutAsmSalesmanCurrentDate = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.withoutoutAsmSalesmanCurrentDate(req.params.id);
  res.send(data);
});

const withoutoutAsmSalesman = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.withoutoutAsmSalesman(req.params.date);
  res.send(data);
});

const dataAllSalesManhistry = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.dataAllSalesManhistry(req.params.id);
  res.send(data);
});

const allocateDeallocateCount = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.allocateDealocateCount(req.params.id);
  res.send(data);
});

const createtemperaryAssigndata = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.createtemperaryAssigndata(req.body);
  res.send(data);
});

const getAllTempReassigndata = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getAllTempReassigndata();
  res.send(data);
});

const getAssignData_by_SalesMan = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getAssignData_by_SalesMan(req.params.page);
  res.send(data);
});

const get_Assign_data_By_SalesManId = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.get_Assign_data_By_SalesManId(req.params.id);
  res.send(data);
});

const getUsersWith_skiped = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getUsersWith_skiped(req.params.id);
  res.send(data);
});

const Return_Assign_To_SalesMan = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.Return_Assign_To_SalesMan(req.params.id);
  res.send(data);
});

const history_Assign_Reaasign_data = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.history_Assign_Reaasign_data(req.params.id, req.params.date, req.params.idSearch);
  res.send(data);
});
const getAllSalesmanShops = catchAsync(async (req, res) => {
  const data = await wardAdminRoleService.getAllSalesmanShops(req.params.id);
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
  getAllSalesMandataCurrentdate,
  createwithoutoutAsmSalesman,
  withoutoutAsmSalesmanCurrentDate,
  withoutoutAsmSalesman,
  dataAllSalesManhistry,
  allocateDeallocateCount,
  createtemperaryAssigndata,
  getAllTempReassigndata,
  getAssignData_by_SalesMan,
  get_Assign_data_By_SalesManId,
  getUsersWith_skiped,
  Return_Assign_To_SalesMan,
  history_Assign_Reaasign_data,
  getAllSalesmanShops,
};
