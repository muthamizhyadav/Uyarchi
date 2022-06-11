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
  res.cookie('tokens', tokens.access.token, options);
  res.cookie('khgk jh', "ujtryfy tfytfyth", options);

  // res.send("hello")
  //   res.clearCookie("tokens");
  res.send({ users, tokens });
});

const B2bUsersLogout = catchAsync(async (req, res) => {
  res.clearCookie('tokens');
  res.clearCookie('login');
  res.send();
});

module.exports = {
  createB2bUsers,
  B2bUsersLogout,
  B2bUsersLogin,
};
