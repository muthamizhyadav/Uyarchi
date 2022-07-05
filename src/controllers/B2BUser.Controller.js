const httpStatus = require('http-status');
const pick = require('../utils/pick');
const { tokenTypes } = require('../config/tokens');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const b2bUsersService = require('../services/B2BUsers.service');
const tokenService = require('../services/token.service');

const createB2bUsers = catchAsync(async (req, res) => {
  const users = await b2bUsersService.createUser(req.body);
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'users Not Fount');
  }
  res.status(httpStatus.CREATED).send(users);
});

const B2bUsersLogin = catchAsync(async (req, res) => {
  const users = await b2bUsersService.UsersLogin(req.body);
  const tokens = await tokenService.generateAuthTokens(users);
  let options = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
  console.log(options);
  res.cookie('tokens', tokens.access.token, options).send({ users, tokens });
  res.send({ users, tokens });
});

const getsalesExecuteRolesUsers = catchAsync(async (req, res) => {
  const users = await b2bUsersService.getsalesExecuteRolesUsers();
  res.send(users);
});

const getUsersById = catchAsync(async (req, res) => {
  const users = await b2bUsersService.getUsersById(req.params.id);
  res.send(users);
});

const B2bUsersAdminLogin = catchAsync(async (req, res) => {
  const users = await b2bUsersService.B2bUsersAdminLogin(req.body);
  const tokens = await tokenService.generateAuthTokens(users);
  let options = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
  console.log(options);
  res.cookie('tokens', tokens.access.token, options).send({ users, tokens });
  res.send({ users, tokens });
});

const B2bUsersLogout = catchAsync(async (req, res) => {
  res.clearCookie('tokens');
  res.clearCookie('login');
  res.send();
});

const smsGateway = catchAsync(async (req, res) => {});

const getAllUsers = catchAsync(async (req, res) => {
  const user = await b2bUsersService.getAllUsers();
  res.send(user);
});

// meta user controller

const createMetaUSers = catchAsync(async (req, res) => {
  const metauser = await b2bUsersService.createMetaUsers(req.body);
  // console.log(metauser);
  console.log('working......');
  res.send(metauser);
});

const getAllMetaUser = catchAsync(async (req, res) => {
  const metauser = await b2bUsersService.getAllmetaUsers();
  res.send(metauser);
});

const getusermetaDataById = catchAsync(async (req, res) => {
  const users = await b2bUsersService.getusermetaDataById(req.params.id);
  res.send(users);
});

const updateMetaUsers = catchAsync(async (req, res) => {
  const users = await b2bUsersService.updateMetaUsers(req.params.id, req.body);
  res.send(users);
});

const getForMyAccount = catchAsync(async (req, res) => {
  let userId = req.userId;
  console.log(userId);
  const users = await b2bUsersService.getForMyAccount(userId);
  res.send(users);
});

const deleteMetaUser = catchAsync(async (req, res) => {
  const users = await b2bUsersService.deleteMetaUser(req.params.id);
  res.send();
});

const changePassword = catchAsync(async (req, res) => {
  let userId = req.userId;
  const users = await b2bUsersService.changePassword(userId, req.body);
  res.send(users);
});
const updatemetadata = catchAsync(async (req, res) => {
  const users = await b2bUsersService.updatemetadata(req.body);
  res.send(users);
});

const forgotPassword = catchAsync(async (req, res) => {
  const users = await b2bUsersService.forgotPassword(req.body);
  res.send(users);
});
const verfiOtp = catchAsync(async (req, res) => {
  const users = await b2bUsersService.otpVerfiy(req.body);
  res.send(users);
});


module.exports = {
  createB2bUsers,
  getsalesExecuteRolesUsers,
  changePassword,
  B2bUsersLogout,
  B2bUsersLogin,
  B2bUsersAdminLogin,
  createMetaUSers,
  getAllUsers,
  getusermetaDataById,
  getAllMetaUser,
  updateMetaUsers,
  deleteMetaUser,
  getForMyAccount,
  getUsersById,
  updatemetadata,
  forgotPassword,
  verfiOtp
};
