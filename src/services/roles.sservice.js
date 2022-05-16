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

const mainWarehouseRoles = async ()=>{
  const roles = await Roles.find({addMainWH:true})
  console.log(roles)
  if(!roles){
    throw new ApiError(httpStatus.NOT_FOUND, "There is No Roles Available For Main WhareHouse Admin")
  }
  return roles
}

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

module.exports = {
  createRoles,
  getAllRoles,
  getRolesById,
  mainWarehouseRoles,
  updateRolesById,
  deleterolesById,
};
