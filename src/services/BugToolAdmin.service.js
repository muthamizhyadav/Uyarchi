const httpStatus = require('http-status');
const { AdminAddUser, AddProjectAdmin, AddProjectAdminSeprate } = require('../models/BugToolAdmin.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const createAdminAddUser = async (body) => {
    let serverdate = moment().format('yyy-MM-DD');
    let time = moment().format('hh:mm a');
    let values = {
        ...body,
        ...{ date: serverdate, time: time },
      };
  return AdminAddUser.create(values);
};

const getAll = async () => {
  return AdminAddUser.find({active:true, disable:false});
};

const getAlluserById = async (id) => {
  return AdminAddUser.findById(id);
};

const updateByUserId = async (id, updateBody) => {
  let data = await getAlluserById(id);
  if (!data && data.active == true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  data = await AdminAddUser.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return data;
};

const createAdminAddproject = async (body) => {
  const {bugToolUser} = body
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  let values = {
      ...body,
      ...{ date: serverdate, time: time },
    };   
const data = await AddProjectAdmin.create(values);
bugToolUser.forEach(async (e) => {
  await AddProjectAdminSeprate.create({
    bugToolUser: e,
    projectName:body.projectName,
    projectSpec:body.projectSpec,
    date: serverdate,
    time: time,
    bugToolUserId:data._id
  });
})
return data
};

// const BugToolusersAndId = async () =>{

// }

const getAllProject = async () => {
  return AddProjectAdmin.find({active:true});
};

const getAllprojectById = async (id) => {
  return AddProjectAdmin.findById(id);
};

const updateByProjectId = async (id, updateBody) => {
  console.log(id)
  let data = await getAllprojectById(id);
  if (!data && data.active == true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Addproject not found');
  }
  data = await AddProjectAdmin.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return data;
};

const deleteUserById = async (id) => {
  const data = await getAlluserById(id);
  if (!data && active == true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  (data.active = false), await data.save();
  return data;
};

const deleteProjectById = async (id) => {
  const data = await getAllprojectById(id);
  if (!data && active == true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'project not found');
  }
  (data.active = false), await data.save();
  return data;
};

module.exports = {
    createAdminAddUser,
    getAll,
    createAdminAddproject,
    getAllProject,
    updateByUserId,
    updateByProjectId,
    deleteUserById,
    deleteProjectById,
};