const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Ecomserive = require('../services/ecomplan.service');

const create_Plans = catchAsync(async (req, res) => {
  const value =await Ecomserive.create_Plans(req);
  res.send(value);
});
const get_all_Plans= catchAsync(async (req, res) => {
  const value =await Ecomserive.get_all_Plans(req);
  res.send(value);
});

const get_one_Plans= catchAsync(async (req, res) => {
  const value =await Ecomserive.get_one_Plans(req);
  res.send(value);
});
const update_one_Plans= catchAsync(async (req, res) => {
  const value =await Ecomserive.update_one_Plans(req);
  res.send(value);
});
const delete_one_Plans= catchAsync(async (req, res) => {
  const value =await Ecomserive.delete_one_Plans(req);
  res.send(value);
});

const create_post= catchAsync(async (req, res) => {
  const value =await Ecomserive.create_post(req);
  res.send(value);
});
const get_all_post= catchAsync(async (req, res) => {
  const value =await Ecomserive.get_all_Post(req);
  res.send(value);
});

const get_one_post= catchAsync(async (req, res) => {
  const value =await Ecomserive.get_one_Post(req);
  res.send(value);
});
const update_one_post= catchAsync(async (req, res) => {
  const value =await Ecomserive.update_one_Post(req);
  res.send(value);
});
const delete_one_post= catchAsync(async (req, res) => {
  const value =await Ecomserive.delete_one_Post(req);
  res.send(value);
});
module.exports = {
  create_Plans,
  get_all_Plans,
  get_one_Plans,
  update_one_Plans,
  delete_one_Plans,
  create_post,
  get_all_post,
  get_one_post,
  update_one_post,
  delete_one_post
};
