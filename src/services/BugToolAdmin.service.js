const httpStatus = require('http-status');
const { AdminAddUser, AddProjectAdmin, AddProjectAdminSeprate, TesterReport } = require('../models/BugToolAdmin.model');
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

const getAll = async (page) => {
  const data = await AdminAddUser.aggregate([
    {
      $match: {
        $and: [{ active: { $eq: true } }],
      },
    },
    {
      $skip: 10 * parseInt(page),
    },
    {
      $limit: 10,
    },
  ])
  const total = await AdminAddUser.aggregate([
    {
      $match:
        { $and: [{ active: { $eq: true } }] }
    },
  ])
  return {data, total:total.length};
};
const UsersLogin = async (userBody) => {
  const { email, password } = userBody;
  let userName = await AdminAddUser.findOne({ email: email });
  if (!userName) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'email Not Registered');
  } else {
    if (await userName.isPasswordMatch(password)) {
      console.log('Password Macthed');
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Passwoed Doesn't Match");
    }
  }
  return userName;
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
  const { bugToolUser } = body
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
      projectName: body.projectName,
      projectSpec: body.projectSpec,
      date: serverdate,
      time: time,
      bugToolUserId: data._id
    });
  })
  return data
};

const BugToolusersAndId = async (id) => {
  const data = await AddProjectAdminSeprate.aggregate([
    {
      $match: {
        $and: [{ bugToolUserId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'bugtoolusers',
        localField: 'bugToolUser',
        foreignField: '_id',
        as: 'bugtoolusers',
      },
    },
    {
      $unwind: '$bugtoolusers',
    },

    {
      $project: {
        name: '$bugtoolusers.name',
        email: '$bugtoolusers.email',
        type: "$bugtoolusers.Type",
        phoneNumber: '$bugtoolusers.phoneNumber',
        userId: "$bugtoolusers._id",
      }
    }
  ])
  return data;
}

const getAllProject = async (page) => {
  const data = await AddProjectAdmin.aggregate([
    {
      $match:
        { $and: [{ active: { $eq: true } }] }
    },
    {
      $skip: 10 * parseInt(page),
    },
    {
      $limit: 10,
    },
  ])
  const total = await AddProjectAdmin.aggregate([
    {
      $match:
        { $and: [{ active: { $eq: true } }] }
    },
  ])
  return {data, total:total.length};
};

const getAllprojectById = async (id) => {
  return AddProjectAdmin.findById(id);
};

const updateByProjectId = async (id, updateBody) => {
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  const arr1 = ["$bugToolUser", updateBody.bugToolUser];
  // const arr2 =;
  // const children = arr1.concat(arr2);
  console.log(arr1)
  const { bugToolUser } = updateBody
  // console.log(bugToolUser)
  let projectdeveloper = await AddProjectAdminSeprate.aggregate([
    {
      $match:
        { $and: [{ bugToolUserId: { $eq: id } }] }
    },
    {
      $project: {
        match: { $in: arr1 },
        projectName: 1,
        bugToolUserId: 1,
        bugToolUser: 1,
        date: 1,
        time: 1,
        projectSpec: 1,
      }
    },
    {
      $match: {
        match: { $eq: false }
      }
    }
  ])
  console.log(projectdeveloper)
  projectdeveloper.forEach(async (e) => {
    await AddProjectAdminSeprate.findByIdAndUpdate({ _id: e._id }, { active: false }, { new: true });
  })
  updateBody.bugToolUser.forEach(async (a) => {
    let ass = await AddProjectAdminSeprate.findOne({
      bugToolUser: a,
      bugToolUserId: id,
    });
    if (!ass) {
      console.log({
        date: serverdate,
        time: time,
        bugToolUser: a,
        bugToolUserId: id,
      })
      await AddProjectAdminSeprate.create({
        date: serverdate,
        time: time,
        bugToolUser: a,
        bugToolUserId: id,
      })
    }
    else {
      if (!ass.active) {
        await AddProjectAdminSeprate.findByIdAndUpdate({ _id: ass._id }, { active: true }, { new: true });
      }
    }

  })

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

const createTesterIssue = async (body) => {
  const data = await AdminAddUser.findById(body.testerId)
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  let values = {
    ...body,
    ...{ date: serverdate, time: time, testerId: body.testerId },

  };
  return TesterReport.create(values);
};



const getAllTesterIssues = async (project, category, status,page) => {
  let match;
  if (project != 'null' && category == 'null' && status == 'null') {
    match = {
      $and: [{ project: { $eq: project } }],
    };
  } else if (project != 'null' && category != 'null' && status == 'null') {
    match = {
      $and: [{ project: { $eq: project } }, { category: { $eq: category } }],
    };
  } else if (project != 'null' && category != 'null' && status != 'null') {
    match = {
      $and: [{ project: { $eq: project } }, { category: { $eq: category } }, { status: { $eq: status } }],
    };
  } else if (project != 'null' && category == 'null' && status != 'null') {
    match = {
      $and: [{ project: { $eq: project } }, { status: { $eq: status } }],
    };
  } else if (project == 'null' && category != 'null' && status != 'null') {
    match = {
      $and: [{ category: { $eq: category } }, { status: { $eq: status } }],
    };
  } else if (project == 'null' && category != 'null' && status == 'null') {
    match = {
      $and: [{ category: { $eq: category } }],
    };
  }
  else if (project == 'null' && category == 'null' && status != 'null') {
    match = {
      $and: [{ status: { $eq: status } }],
    };
  } else {
    match = {
      $and: [{ active: { $eq: true } }],
    };
  }
  console.log(match)
  const data = await TesterReport.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'bugtoolusers',
        localField: 'assignTo',
        foreignField: '_id',
        as: 'bugtoolusers',
      },
    },
    {
      $unwind: '$bugtoolusers',
    },
    {
      $lookup: {
        from: 'addprojectadmins',
        localField: 'project',
        foreignField: '_id',
        as: 'addprojectadmins',
      },
    },
    {
      $unwind: '$addprojectadmins',
    },
    {
      $project: {
        project: 1,
        category: 1,
        severity: 1,
        summary: 1,
        testerId: 1,
        asignName: "$bugtoolusers.name",
        projectName: '$addprojectadmins.projectName',
        date: 1,
        time: 1,
        status: 1,
      }
    },
    {
      $skip: 10 * parseInt(page),
    },
    {
      $limit: 10,
    },
  ])
  const total = await TesterReport.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'bugtoolusers',
        localField: 'assignTo',
        foreignField: '_id',
        as: 'bugtoolusers',
      },
    },
    {
      $unwind: '$bugtoolusers',
    },
    {
      $lookup: {
        from: 'addprojectadmins',
        localField: 'project',
        foreignField: '_id',
        as: 'addprojectadmins',
      },
    },
    {
      $unwind: '$addprojectadmins',
    },
    {
      $project: {
        project: 1,
        category: 1,
        severity: 1,
        summary: 1,
        testerId: 1,
        asignName: "$bugtoolusers.name",
        projectName: '$addprojectadmins.projectName',
        date: 1,
        time: 1,
        status: 1,
      }
    }
  ])
  return {data, total:total.length};
};

const getIdtesterissues = async (id) => {
  return TesterReport.findById(id);
};


const updatetesterissue = async (id, updateBody) => {
  let data = await getIdtesterissues(id);
  if (!data && data.active == true) {
    throw new ApiError(httpStatus.NOT_FOUND, 'issue not found');
  }
  data = await TesterReport.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return data;
};



const getAllTesterIssuestoDeveloper = async (id, project, category, status, page) => {
  let match;
  if (id != 'null' && project != 'null' && category == 'null' && status == 'null') {
    match = {
      $and: [{ assignTo: { $eq: id } }, { project: { $eq: project } }],
    };
  } else if (id != 'null' && project != 'null' && category != 'null' && status == 'null') {
    match = {
      $and: [{ assignTo: { $eq: id } }, { project: { $eq: project } }, { category: { $eq: category } }],
    };
  } else if (id != 'null' && project != 'null' && category != 'null' && status != 'null') {
    match = {
      $and: [{ assignTo: { $eq: id } }, { project: { $eq: project } }, { category: { $eq: category } }, { status: { $eq: status } }],
    };
  } else if (id != 'null' && project != 'null' && category == 'null' && status != 'null') {
    match = {
      $and: [{ assignTo: { $eq: id } }, { project: { $eq: project } }, { status: { $eq: status } }],
    };
  } else if (id != 'null' && project == 'null' && category != 'null' && status != 'null') {
    match = {
      $and: [{ assignTo: { $eq: id } }, { category: { $eq: category } }, { status: { $eq: status } }],
    };
  } else if (id != 'null' && project == 'null' && category != 'null' && status == 'null') {
    match = {
      $and: [{ assignTo: { $eq: id } }, { category: { $eq: category } }],
    };
  }
  else if (id != 'null' && project == 'null' && category == 'null' && status != 'null') {
    match = {
      $and: [{ assignTo: { $eq: id } }, { status: { $eq: status } }],
    };
  } else {
    match = {
      $and: [{ assignTo: { $eq: id } }, { active: { $eq: true } }],
    };
  }
  console.log(match)
  const data = await TesterReport.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'bugtoolusers',
        localField: 'testerId',
        foreignField: '_id',
        as: 'bugtoolusers',
      },
    },
    {
      $unwind: '$bugtoolusers',
    },
    {
      $lookup: {
        from: 'addprojectadmins',
        localField: 'project',
        foreignField: '_id',
        as: 'addprojectadmins',
      },
    },
    {
      $unwind: '$addprojectadmins',
    },
    {
      $project: {
        project: 1,
        category: 1,
        severity: 1,
        summary: 1,
        testerId: 1,
        testerName: "$bugtoolusers.name",
        projectName: '$addprojectadmins.projectName',
        date: 1,
        time: 1,
        status: 1,
      }
    },
    {
      $skip: 10 * parseInt(page),
    },
    {
      $limit: 10,
    },
  ])
  const total = await TesterReport.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: 'bugtoolusers',
        localField: 'testerId',
        foreignField: '_id',
        as: 'bugtoolusers',
      },
    },
    {
      $unwind: '$bugtoolusers',
    },
    {
      $lookup: {
        from: 'addprojectadmins',
        localField: 'project',
        foreignField: '_id',
        as: 'addprojectadmins',
      },
    },
    {
      $unwind: '$addprojectadmins',
    },
    {
      $project: {
        project: 1,
        category: 1,
        severity: 1,
        summary: 1,
        testerId: 1,
        testerName: "$bugtoolusers.name",
        projectName: '$addprojectadmins.projectName',
        date: 1,
        time: 1,
        status: 1,
      }
    }
  ])
  return {data, total:total.length};
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
  BugToolusersAndId,
  getAllprojectById,
  getAlluserById,
  createTesterIssue,
  getAllTesterIssues,
  getIdtesterissues,
  updatetesterissue,
  UsersLogin,
  getAllTesterIssuestoDeveloper,
};