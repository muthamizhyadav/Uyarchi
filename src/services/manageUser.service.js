const httpStatus = require('http-status');
const { ManageUser } = require('../models');
const ApiError = require('../utils/ApiError');

const createManageUser = async (manageUserBody) => {
    return ManageUser.create(manageUserBody);
  };
  
  const getManageUserById = async (id) => {
    const  Manage = ManageUser.findById(id);
    if (!Manage || Manage.active === false) {
      throw new ApiError(httpStatus.NOT_FOUND, ' ManageUser Not Found');
    }
    return  Manage;
  };
  const ManageUserAll = async ()=>{
    const Manage = await ManageUser.find({active:true})
    if(!Manage){
        throw new ApiError(httpStatus.NOT_FOUND, 'Manage not found');
    }
    return Manage;
}
  
  const updateManageUserId = async (manageUserId, updateBody) => {
    let Manage = await getManageUserById(manageUserId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ManageUser not found');
    }
    Manage = await ManageUser.findByIdAndUpdate({ _id: manageUserId }, updateBody, { new: true });
    return Manage;
  };
  
  const deleteManageUserById = async (manageUserId) => {
    const Manage = await getManageUserById(manageUserId);
    if (!Manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ManageUser not found');
    }
    (Manage.active = false), (Manage.archive = true), await Manage.save();
    return Manage;
  };
  
  module.exports = {
      createManageUser,
      getManageUserById,
      ManageUserAll,
      updateManageUserId,
      deleteManageUserById,
  };
  