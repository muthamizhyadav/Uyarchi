const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const manageUserService = require('../services/manageUser.service');

const createmanageUserService = catchAsync(async (req, res) => {
  const user = await manageUserService.createManageUser(req.body);
  console.log(user)
  if (req.files) {
    let path = '';
    console.log(req.files)
    req.files.forEach(function (files, index, arr) {
      path = "images/"+files.filename;
    });
    user.idProofUpload = path;
    // user.addressProofUpload = path;
  }
  res.status(httpStatus.CREATED).send(user);
  await user.save();
});

const getmanageUserServiceById = catchAsync(async (req, res) => {
  const pro = await manageUserService.getManageUserById(req.params.manageUserId);
  if (!pro || pro.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'manageUser not found');
  }
  res.send(pro);
});

const getmanageUserServiceAll = catchAsync(async (req, res) => {
    const manage = await manageUserService.ManageUserAll(req.params);
    if (!manage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'manageUser Not Available ');
    }
    res.send(manage);
  });

const updatemanageUserService = catchAsync(async (req, res) => {
  const pro = await manageUserService.updateManageUserId(req.params.manageUserId, req.body);
  let filenameempty="";
  let inter = pro
  let path = '';
  if (req.files) {
    req.files.forEach(function (files, index, arr) {
      path = "images/"+files.filename
      filenameempty=files.filename
    });
  }
  if(filenameempty == ""){
    pro.idProofUpload = inter.idProofUpload;
    // pro.addressProofUpload = inter.addressProofUpload;
  }else{
//    pro.addressProofUpload = path;
   pro.idProofUpload = path;
 }
  res.send(pro);
  await pro.save();
});

const deletemanageUserService = catchAsync(async (req, res) => {
  await manageUserService.deleteManageUserById(req.params.manageUserId);
  res.status(httpStatus.NO_CONTENT).send();
});
module.exports = {
  createmanageUserService,
  getmanageUserServiceAll,
  getmanageUserServiceById,
  
  updatemanageUserService,
  deletemanageUserService,
};