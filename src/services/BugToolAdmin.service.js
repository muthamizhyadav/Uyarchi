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

const getAll = async () => {
  return AdminAddUser.find({active:true});
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

const BugToolusersAndId = async (id) =>{
   const data = await  AddProjectAdminSeprate.aggregate([
    {
      $match: {
        $and: [{ bugToolUserId: { $eq:id}}],
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
      $project:{
        name:'$bugtoolusers.name',
        email:'$bugtoolusers.email',
        type:"$bugtoolusers.Type",
        phoneNumber:'$bugtoolusers.phoneNumber',
        userId:"$bugtoolusers._id",
      }
    }
      ])
      return data ;
}

const getAllProject = async () => {
  return AddProjectAdmin.find({active:true});
};

const getAllprojectById = async (id) => {
  return AddProjectAdmin.findById(id);
};

const updateByProjectId = async (id, updateBody) => {
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  const {arr} = updateBody
  console.log(arr)
  let projectdeveloper = await AddProjectAdminSeprate.find({bugToolUserId:id, active:true})
  for(let i = 0; i < projectdeveloper.length ; i++){
        for(let j = 0; j < arr.length; j++) {
     if(projectdeveloper[i].bugToolUser == arr[j]){
      console.log(projectdeveloper[i].bugToolUser,"fn")
      await AddProjectAdminSeprate.findOneAndUpdate({ bugToolUser:projectdeveloper[i].bugToolUser, bugToolUserId:id}, {active:true}, {new:true});
     }else{
      console.log(projectdeveloper[i].bugToolUser,"rgt")
      await AddProjectAdminSeprate.findOneAndUpdate({ bugToolUser:projectdeveloper[i].bugToolUser, bugToolUserId:id}, {active:false}, {new:true});
     }
      // let data1 = await AddProjectAdminSeprate.find({bugToolUserId:id, bugToolUser:arr[i], active:true})
      // console.log(data1)
      // if(data1.length == 0){
      //   await AddProjectAdminSeprate.create({
      //     bugToolUser: arr[i],
      //     projectName:updateBody.projectName,
      //     projectSpec:updateBody.projectSpec,
      //     date: serverdate,
      //     time: time,
      //     bugToolUserId:id
      //   });
      // }
    }
  }
  
  // let data = await getAllprojectById(id);
  // if (!data && data.active == true) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Addproject not found');
  // }
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
  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  let values = {
      ...body,
      ...{ date: serverdate, time: time, testerId:body.testerId},

    };
return TesterReport.create(values);
};



const getAllTesterIssues = async (project,category,status) => {
  let match;
  if(project != 'null' && category == 'null' && status == 'null'){
     match = {
      $and: [{ project: { $eq: project} }],
    };
  }else if(project != 'null' && category != 'null' && status == 'null'){
     match = {
      $and: [{ project: { $eq: project} },{category:{$eq:category}}],
    };
  }else if(project != 'null' && category != 'null' && status != 'null'){
     match = {
      $and: [{ project: { $eq: project} },{category:{$eq:category}}, {status:{$eq:status}}],
    };
  }else if(project != 'null' && category == 'null' && status != 'null'){
     match = {
      $and: [{ project: { $eq: project} },{status:{$eq:status}}],
    };
  }else if(project == 'null' && category != 'null' && status != 'null'){
     match = {
      $and: [{ category: { $eq: category} },{status:{$eq:status}}],
    };
  }else if(project == 'null' && category != 'null' && status == 'null'){
     match = {
      $and: [{ category: { $eq: category} }],
    };
  }
  else if(project == 'null' && category == 'null' && status != 'null'){
      match = {
      $and: [{ status: { $eq: status} }],
    };
  }else{
     match = {
      $and: [{ active: { $eq: true} }],
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
      $project:{
        project:1,
        category:1,
        severity:1,
        summary:1,
        testerId:1,
        asignName:"$bugtoolusers.name",
        projectName:'$addprojectadmins.projectName',
        date:1,
        time:1,
        status:1,
      }
    } 
  ])
  return data;
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



const getAllTesterIssuestoDeveloper = async (id,project,category,status) => {
  let match;
  if(id != 'null' && project != 'null' && category == 'null' && status == 'null'){
     match = {
      $and: [{ assignTo: { $eq: id} },{ project: { $eq: project} }],
    };
  }else if(id != 'null' && project != 'null' && category != 'null' && status == 'null'){
     match = {
      $and: [{ assignTo: { $eq: id} },{ project: { $eq: project} },{category:{$eq:category}}],
    };
  }else if(id != 'null' && project != 'null' && category != 'null' && status != 'null'){
     match = {
      $and: [{ assignTo: { $eq: id} },{ project: { $eq: project} },{category:{$eq:category}}, {status:{$eq:status}}],
    };
  }else if(id != 'null' && project != 'null' && category == 'null' && status != 'null'){
     match = {
      $and: [{ assignTo: { $eq: id} },{ project: { $eq: project} },{status:{$eq:status}}],
    };
  }else if(id != 'null' && project == 'null' && category != 'null' && status != 'null'){
     match = {
      $and: [{ assignTo: { $eq: id} },{ category: { $eq: category} },{status:{$eq:status}}],
    };
  }else if(id != 'null' && project == 'null' && category != 'null' && status == 'null'){
     match = {
      $and: [{ assignTo: { $eq: id} },{ category: { $eq: category} }],
    };
  }
  else if(id != 'null' && project == 'null' && category == 'null' && status != 'null'){
      match = {
      $and: [{ assignTo: { $eq: id} },{ status: { $eq: status} }],
    };
  }else{
     match = {
      $and: [{ assignTo: { $eq: id} },{ active: { $eq: true} }],
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
      $project:{
        project:1,
        category:1,
        severity:1,
        summary:1,
        testerId:1,
        testerName:"$bugtoolusers.name",
        projectName:'$addprojectadmins.projectName',
        date:1,
        time:1,
        status:1,
      }
    } 
  ])
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