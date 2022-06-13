const httpStatus = require('http-status');
const { Users } = require('../models/B2Busers.model');
const metaUsers = require('../models/userMeta.model');
const { listeners } = require('../models/supplier.model');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  return Users.create(userBody);
};

const UsersLogin = async (userBody) => {
  const { phoneNumber, password } = userBody;
  let userName = await Users.findOne({ phoneNumber: phoneNumber });
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

const B2bUsersAdminLogin = async (userBody) => {
  const { phoneNumber, password } = userBody;
  let userName = await Users.findOne({ phoneNumber: phoneNumber, userRole: 'fb0dd028-c608-4caa-a7a9-b700389a098d' });
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

const createMetaUsers = async (userBody) => {
  const user = await metaUsers.create(userBody);

  return user;
};

const getAllmetaUsers = async () => {
  return metaUsers.find();
};

const getusermetaDataById = async (id) => {
  const metauser = await metaUsers.findById(id);
  return metauser;
};

const updateMetaUsers = async (id, updateBody) => {
  let metauser = await getusermetaDataById(id);
  console.log(metauser);
  if (!metauser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not Found');
  }
  metauser = await metaUsers.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return metauser;
};

const deleteMetaUser = async (id) => {
  let metauser = await getusermetaDataById(id);
  if (!metauser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'not Found');
  }

  (metauser.active = false), (metauser.archive = true), await metauser.save();
};

module.exports = {
  createUser,
  UsersLogin,
  B2bUsersAdminLogin,
  createMetaUsers,
  updateMetaUsers,
  deleteMetaUser,
  getAllmetaUsers,
  getusermetaDataById,
};
