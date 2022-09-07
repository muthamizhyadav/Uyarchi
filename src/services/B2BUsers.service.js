const httpStatus = require('http-status');
const { Users } = require('../models/B2Busers.model');
const metaUsers = require('../models/userMeta.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const Role = require('../models/roles.model');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const Textlocal = require('../config/textLocal');
const Verfy = require('../config/OtpVerify');
const WardAssign = require('../models/wardAssign.model');
const moment = require('moment');

const createUser = async (userBody) => {
  let value = Users.create(userBody);

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

const getAllUsers = async (page) => {
  let values = await Users.aggregate([
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
        active: 1,
        salary: 1,
        dateOfJoining: 1,
        stepTwo: 1,
        createdAt: 1,
        userrole: '$RoleData.roleName',
        metavalue: '$metadatas',
      },
    },
    {
      $skip: 10 * page,
    },
    {
      $limit: 10,
    },
  ]);
  let total = await Users.aggregate([
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
  ]);
  return { values: values, total: total.length };
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
    $or: [
      { userRole: 'fb0dd028-c608-4caa-a7a9-b700389a098d' },
      { userRole: '33a2ff87-400c-4c15-b607-7730a79b49a9' },
      { userRole: '36151bdd-a8ce-4f80-987e-1f454cd0993f' },
      { userRole: '57243437-a1d4-426f-a705-5da92a630d15' },
      { userRole: '24a28b34-ae15-4f3a-a3e8-24cf5b7be5a1' },
      { userRole: '569d9d3f-285c-434d-99e7-0c415245c40c' },
      { userRole: '719d9f71-8388-4534-9bfe-3f47faed62ac' },
    ],
    stepTwo: true,
    active: true,
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
  let users = await Users.findOne({
    phoneNumber: body.mobileNumber,
    active: true,
    $or: [
      { userRole: 'fb0dd028-c608-4caa-a7a9-b700389a098d' },
      { userRole: '33a2ff87-400c-4c15-b607-7730a79b49a9' },
      { userRole: '36151bdd-a8ce-4f80-987e-1f454cd0993f' },
      { userRole: '57243437-a1d4-426f-a705-5da92a630d15' },
      { userRole: '24a28b34-ae15-4f3a-a3e8-24cf5b7be5a1' },
      { userRole: '569d9d3f-285c-434d-99e7-0c415245c40c' }, // 719d9f71-8388-4534-9bfe-3f47faed62ac
      { userRole: '719d9f71-8388-4534-9bfe-3f47faed62ac' },
    ],
  });
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not Found');
  }
  return await Textlocal.Otp(body, users);
};
const otpVerfiy = async (body) => {
  let users = await Users.findOne({
    phoneNumber: body.mobileNumber,
    active: true,
    $or: [
      { userRole: 'fb0dd028-c608-4caa-a7a9-b700389a098d' },
      { userRole: '33a2ff87-400c-4c15-b607-7730a79b49a9' },
      { userRole: '36151bdd-a8ce-4f80-987e-1f454cd0993f' },
      { userRole: '57243437-a1d4-426f-a705-5da92a630d15' },
      { userRole: '24a28b34-ae15-4f3a-a3e8-24cf5b7be5a1' },
      { userRole: '569d9d3f-285c-434d-99e7-0c415245c40c' },
      { userRole: '719d9f71-8388-4534-9bfe-3f47faed62ac' },
    ],
  });
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
        description: '$RoleData.description',
      },
    },
  ]);
  return values;
};

const getsalesExecuteRolesUsers = async () => {
  let users = await Users.find({
    userRole: ['fb0dd028-c608-4caa-a7a9-b700389a098d', '719d9f71-8388-4534-9bfe-3f47faed62ac'],
  });
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

  // let assign = updateBody.assign.forEach(async (e) => {
  //   let servercreatetime = moment().format('hh:mm a');
  //   let serverdate = moment().format('DD-MM-yyy');
  //   // const assigns = await WardAssign.findOne({
  //   //   user_id: updateBody.userId,
  //   //   key: e.key,
  //   //   value: e.value,
  //   //   assignStatus: 'Assigned',
  //   // });
  //   // if (!assigns) {
  //   //   throw new ApiError(httpStatus.NOT_FOUND, 'WardAssign not Found');
  //   // }
  //   let update = {
  //     userId: updateBody.userId,
  //     key: e.key,
  //     value: e.value,
  //   };
  //   let values = { ...update, ...{ date: serverdate, time: servercreatetime } };
  //   await WardAssign.create(values);
  // });
  return 'success';
};

const updateB2bUsers = async (id, updateBody) => {
  let User = await Users.findById(id);
  if (!User) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Users Not Found');
  }
  User = await Users.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return User;
};

const getUsersDataById = async (id) => {
  let values = await Users.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
      },
    },
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
        active: 1,
        salary: 1,
        dateOfJoining: 1,
        stepTwo: 1,
        createdAt: 1,
        userrole: '$RoleData.roleName',
        userRole: 1,
        metavalue: '$metadatas',
      },
    },
  ]);
  return values;
};

const deleteB2bUsersbyId = async (id) => {
  let users = await Users.findById(id);
  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Users Not Found');
  }

  await Shop.updateMany({ Uid: id }, { $set: { Uid: '3625a112-a7f5-4bd8-b9c3-f86ae03c2f44' } }, { new: true });
  users = await Users.deleteOne({ _id: id });
  return users;
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
  updateB2bUsers,
  getUsersDataById,
  deleteB2bUsersbyId,
};
