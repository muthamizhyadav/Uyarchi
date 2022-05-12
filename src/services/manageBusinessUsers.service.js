const httpStatus = require('http-status');
const { ManageBusinessUser } = require('../models');
const ApiError = require('../utils/ApiError');

const createBusinessUsers = async (BUsersbody) => {
  // let { role } = BUsersbody
  // let value = {}
  // role = ['Ward admin(WA)', 'Ward loading execute(WLE)', 'Ward delivery execute(WDE)', 'Ward admin Bill execute(WABE)', 'Ward admin Account execute(WAAE)', 'Ward admin Operations execute(WAOPE)']
  // value = {...BUsersbody, ...{role}}

  return ManageBusinessUser.create(value)
};

const getSixRoles = async ()=>{
  let role = ['Ward admin(WA)', 'Ward loading execute(WLE)', 'Ward delivery execute(WDE)', 'Ward admin Bill execute(WABE)', 'Ward admin Account execute(WAAE)', 'Ward admin Operations execute(WAOPE)']
  return role
}
const getBusinessUsersById = async (BUId) => {
  const Busers = await ManageBusinessUser.findById(BUId);
  if (!Busers) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business Users Not Found');
  }
  return Busers;
};

const getAllBusinessUsers = async () => {
  return ManageBusinessUser.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'roletype',
        foreignField: '_id',
        as: 'rolesData',
      },
    },
    {
      $unwind: '$rolesData',
    },
    {
      $project: {
        RoleName: '$rolesData.roleName',
        uname:1,
      },
    },
  ])
};

const updateBusinessUsers = async (BUId, updateBody) => {
  const busers = await getBusinessUsersById(BUId);
  if (!busers) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business Users Not Found');
  }

  busers = await ManageBusinessUser.findOneAndUpdate({ _id: BUId }, updateBody, { new: true });
  await busers.save();
  return busers;
};

const deleteBusinessUsers = async (BUId) => {
  const busers = await getBusinessUsersById(BUId);
  if (!busers) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business Users Not Found');
  }
  (busers.active = false), (busers.archive = true);
  await busers.save();
  return busers;
};

module.exports = {
    createBusinessUsers,
    getBusinessUsersById,
    getAllBusinessUsers,
    updateBusinessUsers,
    getSixRoles,
    deleteBusinessUsers,
}
