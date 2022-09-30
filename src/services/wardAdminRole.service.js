const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const  {WardAdminRole, WardAdminRoleAsm, AsmSalesMan, SalesManShop, WithoutAsmSalesman} = require('../models/wardAdminRole.model');
const {Shop} = require('../models/b2b.ShopClone.model')
const {Users} = require('../models/B2Busers.model')
const moment = require('moment');

const createwardAdminRole = async (body) => {
    let serverdate = moment().format('yyy-MM-DD');
    let time = moment().format('hh:mm a')
    let values = {}
    values = { ...body, ...{ date:serverdate, time:time, startingValue:body.targetValue, startingTonne:body.targetTonne} };

    const data = await WardAdminRole.create(values);
    return data;
};


const getAll = async (date) => {
  if (date != 'null') {
    match = [{date: { $eq: date }},]
  } else {
    match = [{active: { $eq: true }}];
  }
  const data = await WardAdminRole.aggregate([
    { $sort: {date: -1}},
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'b2bUserId',
        foreignField: '_id',
        as: 'Asmb2busersData',
      },
    },
    {
      $unwind: '$Asmb2busersData',
    },
    {
      $project:{
        name:'$Asmb2busersData.name',
        targetTonne:1,
        targetValue:1,
        b2bUserId:1,
        startingValue:1,
        startingTonne:1,
        unit:1,
        date:1,
        time:1,
        _id:1,
      }
    }
  ])
  return data;
};

const getWardAdminRoleById = async (id) => {
  const data = await WardAdminRole.findById(id);
  if (!data || data.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wardAdminRole Not Found');
  }
  return data;
};

const createwardAdminRoleAsm = async (body) => {
    let serverdate = moment().format('yyy-MM-DD');
    let time = moment().format('hh:mm a')
    let values = {}
     values = { ...body, ...{ date:serverdate, time:time} };
     const data = await WardAdminRoleAsm.create(values);
     return data;
};

const getAllWardAdminRoleData = async (id) =>{
    let data = await WardAdminRole.aggregate([
      {
        $match: {
          $and: [{_id: { $eq: id } }],
        },
      },

    ])
    return data ;
}

const smData = async (date) =>{
  let match ;
  if (date != 'null') {
    match = [{'wardadminroleasmsData.date': { $eq: date } },]
  } else {
    match = [{'wardadminroleasmsData.active': { $eq: true } }];
  }
  let data = await WardAdminRole.aggregate([
    {
      $lookup: {
        from: 'b2busers',
        localField: 'b2bUserId',
        foreignField: '_id',
        as: 'Asmb2busersData',
      },
    },
    {
      $unwind: '$Asmb2busersData',
    },
    {
      $lookup: {
        from: 'wardadminroleasms',
        localField: '_id',
        foreignField: 'wardAdminId',
        as: 'wardadminroleasmsData',
      },
    },
    {
      $unwind: '$wardadminroleasmsData',
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'wardadminroleasmsData.salesman',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $match: {
        $and: match,
      },
    },
    { $sort: { 'wardadminroleasmsData.date': -1} },
    {
      $project: {
        salesmanName: '$b2busersData.name',
        targetValue: '$wardadminroleasmsData.targetValue',
        targetTonne:'$wardadminroleasmsData.targetTonne',
        // wardAdminId:'$wardadminroleasmsData.wardAdminId',
        b2buserId: '$wardadminroleasmsData.salesman',
        date:'$wardadminroleasmsData.date',
        time:'$wardadminroleasmsData.time',
        Asm:'$Asmb2busersData.name',
        _id: 1,
      },
    },
  ])
  return data ;
}

const total = async (id, updateBody) => {
  let data = await getWardAdminRoleById(id);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'WardAdminRole not found');
  }
  let value =  updateBody.targetValue;
  let tone  = updateBody.targetTonne;
  let asmvalue = data.targetValue;
  let asmtone = data.targetTonne;
  let value1 = asmvalue - value ;
  let tone1 = asmtone - tone ;


  data = await WardAdminRole.findByIdAndUpdate({ _id: id }, {targetValue: value1, targetTonne: tone1}, { new: true });
  return data;
};

// getAllSalesMandataCurrentdate
const getAllSalesMandataCurrentdate = async (id) => {
  let serverdate = moment().format('yyy-MM-DD');
  const data = await WardAdminRoleAsm.find({salesman:id, active:true, date:serverdate});
  return data;
};



const createAsmSalesman = async (body) => {
  let {arr} = body
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a')
  if(body.status == "Assign"){
  arr.forEach(async (e) => {
    await Users.findByIdAndUpdate({ _id: e }, {salesManagerStatus:body.status}, { new: true });
    await AsmSalesMan.create({
      asmId:body.asmId,
      salesManId:e,
      status:body.status,
      date:serverdate,
      time:time,
      date:serverdate,
  });

})
  }else {
    arr.forEach(async (e) => {
      let data = await AsmSalesMan.find({asmId:body.asmId, salesManId:e, status:'Assign'})
      data.forEach(async (f) => {
      await Users.findByIdAndUpdate({ _id: f.salesManId }, {salesManagerStatus:body.status}, { new: true });
      await AsmSalesMan.findByIdAndUpdate({_id:f._id},
        {asmId:f.asmId,
        salesManId:f.salesManId,
        status:body.status,
        reAssignDate:serverdate,
        reAssignTime:time},{new:true});
        })
   })
  }
    return "created"
}

const getAsmSalesman = async (id) =>{
  let data = await AsmSalesMan.aggregate([
    {
      $match: {
        $and: [{asmId: { $eq: id } },{status: { $eq: 'Assign' } }],
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'salesManId',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $project: {
        salesmanName: '$b2busersData.name',
        salesManId:1,
        status:1,
        asmId:1,
        date:1,
        time:1,
        _id: 1,
      },
    },
  ])
  return data;
}

const allAssignReassignSalesman = async (id) => {
  const data = await AsmSalesMan.aggregate([
    {
      $match: {
        $and: [{asmId: { $eq: id } }],
      },
    },
  ])
  return data ;
}

const createSalesmanShop = async (body) => {
  let {arr} = body
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a')
  if(body.status == "Assign"){
  arr.forEach(async (e) => {
    await Shop.findByIdAndUpdate({ _id: e }, {salesManStatus:body.status}, { new: true });
    await SalesManShop.create({
      salesManId:body.salesManId,
      shopId:e,
      status:body.status,
      date:serverdate,
      time:time,
      date:serverdate,
  });

})
  }else {
    arr.forEach(async (e) => {
      let data = await SalesManShop.find({ salesManId:body.salesManId, shopId:e,  status:'Assign'})
      data.forEach(async (f) => {
      await Shop.findByIdAndUpdate({ _id: f.shopId }, {salesManStatus:body.status}, { new: true });
      await SalesManShop.findByIdAndUpdate({_id:f._id},
        {salesManId:f.salesManId,
        shopId:f.shopId,
        status:body.status,
        reAssignDate:serverdate,
        reAssignTime:time},{new:true});
        })
   })
  }
    return "created"
}

const getSalesman = async (id) =>{
  let data = await SalesManShop.aggregate([
    {
      $match: {
        $and: [{salesManId: { $eq: id } },{status: { $eq: 'Assign' } }],
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'b2bshopclonesData',
      },
    },
    {
      $unwind: '$b2bshopclonesData',
    },
    {
      $lookup: {
        from: 'wards',
        localField: 'b2bshopclonesData.Wardid',
        foreignField: '_id',
        as: 'wardsData',
      },
    },
    {
      $unwind: '$wardsData',
    },
    {
      $lookup: {
        from: 'zones',
        localField: 'wardsData.zoneId',
        foreignField: '_id',
        as: 'zonesData',
      },
    },
    {
      $unwind: '$zonesData',
    },
    {
      $project: {
        shopname:'$b2bshopclonesData.SName',
        salesManId:1,
        shopId:1,
        ward:'$wardsData.ward',
        zone:'$zonesData.zone',
        status:1,
        reAssignDate:1,
        reAssignTime:1,
        date:1,
        time:1,
        _id: 1,
      },
    },
  ])
  return data;
}

// withoutoutAsmSalesman 
const createwithoutoutAsmSalesman = async (body) => {
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a')
  let values = {}
  values = { ...body, ...{ date:serverdate, time:time} };
const data = await WithoutAsmSalesman.create(values);
return data;
};

//withoutoutAsmSalesmanCurrentDate
const withoutoutAsmSalesmanCurrentDate = async (id) => {
  let serverdate = moment().format('yyy-MM-DD');
  const data = await WithoutAsmSalesman.find({salesman:id, active:true, date:serverdate});
  return data;
};

const withoutoutAsmSalesman = async (date) => {
  let match ;
  if (date != 'null') {
    match = [{date: { $eq: date } },]
  } else {
    match = [{active: { $eq: true } }];
  }
  const data = await WithoutAsmSalesman.aggregate([
    {
      $match: {
        $and:match
      },
    },
      {
      $lookup: {
        from: 'b2busers',
        localField: 'salesman',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },

    {
      $project: {
        salesmanName:'$b2busersData.name',
        targetTonne:1,
        targetValue:1,
        salesman:1,
        unit:1,
        date:1,
        time:1,
        _id: 1,
      },
    },

  ]);
  return data;
};

const dataAllSalesManhistry = async  (id) => {
    let data = await SalesManShop.aggregate([
      {
        $match: {
          $and: [{salesManId: { $eq: id } }],
        },
      },
    ])
  
    return data ;
}


 const  allocateDealocateCount = async (id) => {
  let data = await Users.aggregate([
    {
      $match: {
        $and: [{_id: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: '_id',
        foreignField: 'salesManId',
        as: 'salesmanshopsData',
      },
    },
    {
      $unwind: '$salesmanshopsData',
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: 'salesmanshopsData.date',
        foreignField: 'date',
        pipeline:[
          {
            $match: {
              $and: [{status: { $eq: "Assign" } }],
            },
          }, 
        ],
        as: 'salesmanshopsAssign',
      },
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: 'salesmanshopsData.date',
        foreignField: 'reAssignDate',
        pipeline:[
          {
            $match: {
              $and: [{status: { $eq: "Reassign" } }],
            },
          }, 
        ],
        as: 'salesmanshopsReassign',
      },
    },
    {$sort:{'salesmanshopsData.date':-1}},
    {
      $project: {
         assignCount:{$size:"$salesmanshopsAssign"},
         reassignCount:{$size:"$salesmanshopsReassign"},
         date: '$salesmanshopsData.date',
        //  sum:{ $subtract:[{$size:"salesmanshopsReassign"},{$size:"salesmanshopsReassign"}]} 
      },
    },

  ])
  return data
 }
module.exports = {
  createwardAdminRole,
  getAll,
  getWardAdminRoleById,
  createwardAdminRoleAsm,  
  getAllWardAdminRoleData,
  smData,
  total,
  createAsmSalesman,
  getAsmSalesman,
  allAssignReassignSalesman,
  createSalesmanShop,
  getSalesman,
  getAllSalesMandataCurrentdate,
  createwithoutoutAsmSalesman,
  withoutoutAsmSalesmanCurrentDate,
  withoutoutAsmSalesman,
  dataAllSalesManhistry,
  allocateDealocateCount,
}