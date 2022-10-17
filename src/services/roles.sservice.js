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
      //   pipeline:[
      //     {
      //       $lookup: {
      //         from: 'wardadminroles',
      //         let: {
      //           localField: '$_id',
      //         },
      //         pipeline: [{ $match: { $expr: { $eq: ['$b2bUserId', '$$localField'] } } }],
      //         as: 'wardadminrolesData',
      //       },
      //     },
      //     {
      //       $unwind: {
      //         path: '$wardadminrolesData',
      //         preserveNullAndEmptyArrays: true,
      //       },
      //     },
      //  ],
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
        // wardadminrolesData:'$b2busersData.wardadminrolesData'
      },
    },
    // {
    //   $match: { wardadminrolesData: { $eq: null } },
    // },
  ]);
  return data;
};

// notAssignTonneValueSalesmanager
const notAssignTonneValueSalesmanager = async () => {
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
        pipeline:[
          {
            $lookup: {
              from: 'wardadminroles',
              let: {
                localField: '$_id',
              },
              pipeline: [{ $match: { $expr: { $eq: ['$b2bUserId', '$$localField'] } } }],
              as: 'wardadminrolesData',
            },
          },
          // {
          //   $unwind:'$wardadminrolesData',
          //     // preserveNullAndEmptyArrays: true,
          // },
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
        // wardadminrolesData:'$b2busersData.wardadminrolesData'
        b2user:'$b2busersData.wardadminrolesData'
      },
    },
    {
      $match:{ $and:[{ b2user: { $type: 'array', $ne: [] } }] },
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
        // pipeline: [
        //   {
        //     $lookup: {
        //       from: 'wardadminroleasms',
        //       let: {
        //         localField: '$_id',
        //       },
        //       pipeline: [{ $match: { $expr: { $eq: ['$b2bUserId', '$$localField'] } } }],
        //       as: 'wardadminroleasmsData',
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: '$wardadminroleasmsData',
        //       preserveNullAndEmptyArrays: true,
        //     },
        //   },
        // ],
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
        // wardadminroleasmsData: '$b2busersData.wardadminroleasmsData',
      },
    },
    // {
    //   $match: { wardadminroleasmsData: { $eq: null } },
    // },
  ]);
  return data;
};

const getAlldataSalesManager = async () =>{
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
  ])
  return data ;
}

const getAlldataSalesMan = async (page) =>{
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
        pipeline:[ 
        //   {
        //   $match: {
        //     $or: [{ salesManagerStatus: { $ne:'Assign' } },{ salesManagerStatus: { $eq:null} },{ salesManagerStatus: { $eq:'Reassign'} }],
        //   },
        // },
        {
          $lookup: {
            from: 'salesmanshops',
            let: {
                      localField: '$_id',
                    },
                    pipeline: [{ $match: { $expr: { $eq: ['$fromSalesManId', '$$localField'] } } }],
            as: 'salesmanshopsData',
          },
        },
        // {
        //       $unwind: {
        //         path: '$salesmanshopsData',
        //         preserveNullAndEmptyArrays: true,
        //       },
        //     },
        {
          $match:{
             $and: [{ salesmanshopsData: { $type: 'array', $eq: [] } }]
          }
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
        mobileNumber:'$b2busersData.phoneNumber',
        email:"$b2busersData.email",
        roleName: 1,
        _id: 1,
        // data:"$b2busersData.salesmanshopsData"
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ])
  return data ;
}

// get all salesman 
const getsalesman = async () =>{
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
  ])
  return data ;
}

// getAllSalesmanShops 
const getAllSalesmanShops = async () =>{
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
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    }, 
    {
      $lookup: {
        from: 'salesmanshops',
        localField: 'b2busersData._id',
        pipeline:[    {
          $match: {
            $and: [{ status: { $eq:"Assign"} }],
          },
        },],
        foreignField: 'salesManId',
        as: 'salesmanshopsData',
      },
    },
    // {
    //   $unwind: '$salesmanshopsData',
    // }, 
    // {
    //   $lookup: {
    //     from: 'b2bshopclones',
    //     localField: 'salesmanshopsData.shopId',
    //     foreignField: '_id',
    //     as: 'b2bshopclonesData',
    //   },
    // },
    // {
    //   $unwind: '$b2bshopclonesData',
    // }, 

    {
      $project: {
        salesmanName: '$b2busersData.name',
        salemanId: '$b2busersData._id',
        // shopsId:'$b2bshopclonesData._id',
        // SName:'$b2bshopclonesData.SName',
        shopCount:{$size:"$salesmanshopsData"},
        _id: 1,
      },
    },
  ])
  return data ;
}

module.exports = {
  createRoles,
  getAllRoles,
  getRolesById,
  mainWarehouseRoles,
  updateRolesById,
  deleterolesById,
  getroleWardAdmin,
  getroleWardAdminAsm,
  getAlldataSalesManager,
  getAlldataSalesMan,
  getsalesman,
  getAllSalesmanShops,
  notAssignTonneValueSalesmanager,
};
