const httpStatus = require('http-status');
const { Users } = require('../models/B2Busers.model');
const metaUsers = require('../models/userMeta.model');
const Role = require('../models/roles.model');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const Textlocal = require('../config/textLocal');
const Verfy = require('../config/OtpVerify');

const createUser = async (userBody) => {
  let OTPCODE = Math.floor(1000000 + Math.random() * 9000000);
  let password = { password: OTPCODE };
  let bodyData = { ...userBody, ...password };
  let value = Users.create(bodyData);
  await Textlocal.sendPwd(userBody.phoneNumber, userBody.name, OTPCODE);
  return value;
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
  return Users.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'userRole',
        foreignField: '_id',
        pipeline: [
          {
            $project: {
              roleName: 1,
            },
          },
        ],
        as: 'RoleData',
      },
    },
    {
      $unwind: '$RoleData',
    },
    {
      $lookup: {
        from: 'musers',
        localField: '_id',
        foreignField: 'user_id',
        as: 'metadatas',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phoneNumber: 1,
        stepTwo: 1,
        createdAt: 1,
        userrole: '$RoleData.roleName',
        metavalue: '$metadatas',
      },
    },
  ]);
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
  console.log(password);
  const salt = await bcrypt.genSalt(7);
  let passwor = { password: await bcrypt.hash(password.toString(), salt) };
  console.log(passwor);
  let userName = await Users.findOne({
    phoneNumber: phoneNumber,
    userRole: 'fb0dd028-c608-4caa-a7a9-b700389a098d',
    stepTwo: true,
  });
  if (!userName) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Phone Number Not Registered');
  } else {
    console.log(await userName.isPasswordMatch(password));
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
  ]);
  return values;
};
const getsalesExecuteRolesUsers = async () => {
  let users = await Users.find({ userRole: 'fb0dd028-c608-4caa-a7a9-b700389a098d' });
  return users;
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
const updatemetadata = async (updateBody) => {
  updateBody.metavalue.forEach(async (e) => {
    console.log(e.key);
    const metauser = await metaUsers.findOne({ user_id: updateBody.userId, metaKey: e.key });
    let update = {
      user_id: updateBody.userId,
      metaKey: e.key,
      metavalue: e.value,
    };
    await Users.findOneAndUpdate({ _id: updateBody.userId }, { stepTwo: true }, { new: true });
    if (metauser) {
      await metaUsers.findByIdAndUpdate({ _id: metauser.id }, update, { new: true });
    } else {
      await metaUsers.create(update);
    }
  });
  return 'success';
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
  getUsersById,
  getusermetaDataById,
  getForMyAccount,
  getsalesExecuteRolesUsers,
  updatemetadata,
  forgotPassword,
  otpVerfiy,
};
