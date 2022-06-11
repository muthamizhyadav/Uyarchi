const httpStatus = require('http-status');
const b2bUsers = require('../models/B2Busers.model');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  // if (await b2bUsers.isEmailTaken(userBody.email)) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  return b2bUsers.create(userBody);
};

const B2bUsersLogin = async (phoneNumber, password) => {
  let userName = await b2bUsers.findOne({ phoneNumber: phoneNumber });
  if (!userName) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Phone Number Not Registered');
  } else {
    if (await userName.isPasswordMatch(password)) {
      console.log('Password Macthed');
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Passwoed Doesn't Match");
    }
  }
  return userName;
};

module.exports = {
  createUser,
  B2bUsersLogin,
};
