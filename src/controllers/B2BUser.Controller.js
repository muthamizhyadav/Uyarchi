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
  //   const tokens = await tokenService.generateAuthTokens(users);
  res.status(httpStatus.CREATED).send(users);
});

const B2bUsersLogin = catchAsync(async (req, res) => {
  const users = await b2bUsersService.B2bUsersLogin(req.body);
  const tokens = await tokenService.generateAuthTokens(users);
  let options = {
    httpOnly: true,
    // expires: new Date(Date.now() + 100000000),
    maxAge: 24 * 60 * 60 * 1000,
  };
  console.log(options);
  res.cookie('tokens', tokens.access.token, options).send({ users, tokens });

  // res.cookie('khgk jh', "ujtryfy tfytfyth", options);

  // res.send("hello")
  //   res.clearCookie("tokens");
  res.send({ users, tokens });
});

const B2bUsersAdminLogin = catchAsync(async (req, res) => {
  const users = await b2bUsersService.B2bUsersAdminLogin(req.body);
  const tokens = await tokenService.generateAuthTokens(users);
  let options = {
    httpOnly: true,
    // expires: new Date(Date.now() + 100000000),
    maxAge: 24 * 60 * 60 * 1000,
  };
  console.log(options);
  res.cookie('tokens', tokens.access.token, options).send({ users, tokens });

  // res.cookie('khgk jh', "ujtryfy tfytfyth", options);

  // res.send("hello")
  //   res.clearCookie("tokens");
  res.send({ users, tokens });
});

const B2bUsersLogout = catchAsync(async (req, res) => {
  res.clearCookie('tokens');
  res.clearCookie('login');
  res.send();
});

// meta user controller

const createmetauser = catchAsync(async (req, res) => {
  const metauser = await b2bUsersService.createMetaUsers(req.body);
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

const deleteMetaUser = catchAsync(async (req, res) => {
  const users = await b2bUsersService.deleteMetaUser(req.params.id);
  res.send();
});

module.exports = {
  createB2bUsers,
  B2bUsersLogout,
  B2bUsersLogin,
  B2bUsersAdminLogin,
  createmetauser,
  getusermetaDataById,
  getAllMetaUser,
  updateMetaUsers,
  deleteMetaUser,
};
