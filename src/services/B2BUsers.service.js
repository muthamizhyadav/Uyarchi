const httpStatus = require('http-status');
const { Users } = require('../models/B2Busers.model');
const metaUsers = require('../models/userMeta.model');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
  return Users.create(userBody);  
};

const getUsersById = async (id) => {
  let user = await Users.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Users Not Found');
  }
  let role = await Role.findOne({ _id: user.userRole });
  return { userData: user, RoleData: role };
};

const getAllUsers = async () => {
  return Users.find();
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

const forgotPassword = async (body) => {
  // const { phoneNumber } = body;
  // await Textlocal.Otp(body);
  let users = await Users.findOne({ phoneNumber: body.mobileNumber, userRole: 'fb0dd028-c608-4caa-a7a9-b700389a098d' });
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not Found');
  }
  return await Textlocal.Otp(body, users);
};
const otpVerfiy = async (body) => {
  // const { phoneNumber } = body;
  // await Textlocal.Otp(body);
  let users = await Users.findOne({ phoneNumber: body.mobileNumber, userRole: 'fb0dd028-c608-4caa-a7a9-b700389a098d' });
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not Found');
  }

  return await Verfy.verfiy(body, users);
};

const getForMyAccount = async (userId) => {
  let values = await Users.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: userId } }],
      },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'userRole',
        foreignField: '_id',
        as: 'RoleData',
      },
    },
    {
      $unwind: '$RoleData',
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phoneNumber: 1,
        roleName: '$RoleData.roleName',
      },
    },
    {
      $skip:10*parseInt(page)
    },
   {
      $limit:10
    },
  ]);
  return values;
};

const changePassword = async (userId, body) => {
  let user = await Users.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user Not Found');
  }
  const salt = await bcrypt.genSalt(10);
  let { password } = body;
  password = await bcrypt.hash(password, salt);
  user = await Users.findByIdAndUpdate({ _id: userId }, { password: password }, { new: true });
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
  getAllUsers,
  deleteMetaUser,
  getAllmetaUsers,
  changePassword,
  getusermetaDataById,
  getForMyAccount,
  getsalesExecuteRolesUsers,
  updatemetadata,
  forgotPassword,
  otpVerfiy,
};
