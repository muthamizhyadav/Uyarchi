const httpStatus = require('http-status');
const { ManageUser } = require('../models');
const ApiError = require('../utils/ApiError');

const createManageUser = async (manageUserBody) => {
    const check = await ManageUser.find({mobileNumber:manageUserBody.mobileNumber})
    console.log(check);
    if(check != ""){
      throw new ApiError(httpStatus.NOT_FOUND, 'already register the number');
    }
    return ManageUser.create(manageUserBody);
  };
  
  const getManageUserById = async (id) => {
    const  Manage = ManageUser.findById(id);
    if (!Manage || Manage.active === false) {
      throw new ApiError(httpStatus.NOT_FOUND, ' ManageUser Not Found');
    }
    return  Manage;
  };

  // const getManageUserByMobile = async (mobileNumber) => {
  //   return ManageUser.findOne({ mobileNumber });
  // };

  const loginManageUserEmailAndPassword = async (mobileNumber,dateOfBirth) => {
    const interviewerRegistration = await ManageUser.find({mobileNumber:mobileNumber});
    console.log(interviewerRegistration[0].dateOfBirth)
  let dob=interviewerRegistration[0].dateOfBirth.replace(/[^0-9\.]+/g, "")
  if(interviewerRegistration !=""){
    if(dob==dateOfBirth){
    }
    else{
      throw new ApiError(httpStatus.NOT_FOUND, 'DOB Not Match');
    }
  }
  else{
    throw new ApiError(httpStatus.NOT_FOUND, 'Mobile Number Not Registored');
  }

    return interviewerRegistration;
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
      loginManageUserEmailAndPassword,
  };
  