const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const telecallerService = require('../services/telecallerAssign.service');

const createtelecallerAssignReassign = catchAsync(async (req, res) => {
  const data = await telecallerService.createtelecallerAssignReassign(req.body);
  res.send(data);
});

const getAllTelecallerHead = catchAsync(async (req, res) => {
  const data = await telecallerService.getAllTelecallerHead(req.body);
  res.send(data);
});

const getUnassignedtelecaller = catchAsync(async (req, res) => {
  const data = await telecallerService.getUnassignedtelecaller(req.params.page);
  res.send(data);
});

const gettelecallerheadTelecallerdata = catchAsync(async (req, res) => {
  const data = await telecallerService.gettelecallerheadTelecaller(req.params.id);
  res.send(data);
});

const createTelecallerShop = catchAsync(async (req, res) => {
  const data = await telecallerService.createTelecallerShop(req.body);
  res.send(data);
});

const getAllTelecaller = catchAsync(async (req, res) => {
  const data = await telecallerService.getAllTelecaller();
  res.send(data);
});

const getTelecallerAssignedShops = catchAsync(async (req, res) => {
  const data = await telecallerService.getTelecallerAssignedShops(req.params.id);
  res.send(data);
});

const getnotAssignShops = catchAsync(async (req, res) => {
  const data = await telecallerService.getnotAssignShops(req.params.id, req.params.page, req.params.limit, req.params.uid, req.params.date);
  res.send(data);
});

const getUsersWith_skiped = catchAsync(async (req, res) => {
  const data = await telecallerService.getUsersWith_skiped(req.params.id);
  res.send(data);
});

const Return_Assign_To_telecaller = catchAsync(async (req, res) => {
  const data = await telecallerService.Return_Assign_To_telecaller(req.params.id);
  res.send(data);
});

const createtemperaryAssigndata = catchAsync(async (req, res) => {
  const data = await telecallerService.createtemperaryAssigndata(req.body);
  res.send(data);
});

const getAssignData_by_Telecaller = catchAsync(async (req, res) => {
  const data = await telecallerService.getAssignData_by_Telecaller(req.params.page);
  res.send(data);
});

const assignShopsTelecaller = catchAsync(async (req, res) => {
  const data = await telecallerService.assignShopsTelecaller(req.params.id, req.params.page);
  res.send(data);
});

const assignShopsTelecallerdatewise = catchAsync(async (req, res) => {
  const data = await telecallerService.assignShopsTelecallerdatewise(req.params.id, req.params.wardid, req.params.page);
  res.send(data);
});

const assignShopsOnlydatewise = catchAsync(async (req, res) => {
  const data = await telecallerService.assignShopsOnlydatewise(req.params.id, req.params.wardid, req.params.page);
  res.send(data);
});

module.exports = { createtelecallerAssignReassign, getAllTelecallerHead, getUnassignedtelecaller, gettelecallerheadTelecallerdata, createTelecallerShop, getAllTelecaller, getTelecallerAssignedShops, getnotAssignShops, getUsersWith_skiped, Return_Assign_To_telecaller, createtemperaryAssigndata, getAssignData_by_Telecaller, assignShopsTelecaller, assignShopsTelecallerdatewise, assignShopsOnlydatewise};