const httpStatus = require('http-status');
const { Roles } = require('../models');
const ApiError = require('../utils/ApiError');

const createRoles = async (rolesBody) => {
  return Roles.create(rolesBody);
};

const getAllRoles = async () => {
  return Roles.find();
};

// const queryRoles = async (filter, options) => {
//   return Roles.paginate(filter, options);
// };

const mainWarehouseRoles = async () => {
  const roles = await Roles.find({ addMainWH: true });
  console.log(roles);
  if (!roles) {
    throw new ApiError(httpStatus.NOT_FOUND, 'There is No Roles Available For Main WhareHouse Admin');
  }
  return roles;
};

const getRolesById = async (id) => {
  const role = Roles.findById(id);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Roles  Not Found');
  }
  return role;
};

const updateRolesById = async (roleId, updateBody) => {
  const role = await Roles.findByIdAndUpdate({ _id: roleId }, updateBody, { new: true });
  return role;
};

const deleterolesById = async (roleId) => {
  const roles = await getLoadingExecuteById(roleId);
  if (!roles) {
    throw new ApiError(httpStatus.NOT_FOUND, 'roles not found');
  }
  (roles.active = false), (roles.archive = true), await roles.save();
  return roles;
};

const getroleWardAdmin = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Admin Sales Manager (WASM)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        _id: 1,
      },
    },
  ]);
  return data;
};

const getroleWardAdminAsm = async () => {
  let data = await Roles.aggregate([
    {
      $match: {
        $and: [{ roleName: { $eq: 'Ward Field Sales Executive(WFSE)' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: '_id',
        foreignField: 'userRole',
        pipeline: [
          {
            $lookup: {
              from: 'wardadminroleasms',
              let: {
                localField: '$_id',
              },
              pipeline: [{ $match: { $expr: { $eq: ['$b2bUserId', '$$localField'] } } }],
              as: 'wardadminroleasmsData',
            },
          },
          {
            $unwind: {
              path: '$wardadminroleasmsData',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },

    {
      $project: {
        name: '$b2busersData.name',
        b2buserId: '$b2busersData._id',
        roleName: 1,
        _id: 1,
        wardadminroleasmsData: '$b2busersData.wardadminroleasmsData',
      },
    },
    {
      $match: { wardadminroleasmsData: { $eq: null } },
    },
  ]);
  return data;
};

module.exports = {
  createRoles,
  getAllRoles,
  getRolesById,
  mainWarehouseRoles,
  updateRolesById,
  deleterolesById,
  getroleWardAdmin,
  getroleWardAdminAsm,
};
