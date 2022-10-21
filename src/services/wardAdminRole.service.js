const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {
  WardAdminRole,
  WardAdminRoleAsm,
  AsmSalesMan,
  SalesManShop,
  WithoutAsmSalesman,
  WardAdminRoleAsmHistory,
  WardAdminRoleHistory,
  WithoutAsmWithAsm,
} = require('../models/wardAdminRole.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const { Users } = require('../models/B2Busers.model');
const moment = require('moment');
const { findByIdAndUpdate } = require('../models/b2b.pettyStock.model');
const { ValidationRequestList } = require('twilio/lib/rest/api/v2010/account/validationRequest');

const createwardAdminRole = async (body) => {
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  let values = {};
  let values1 = {
    ...body,
    ...{ date: serverdate, time: time },
  }
  await WardAdminRoleHistory.create(values1)
  const value = await WardAdminRole.find({ b2bUserId: body.b2bUserId, date: serverdate });
  if (value.length != 0) {
    value.forEach(async (e) => {
      e.targetValue += parseInt(body.targetValue)
      e.targetTonne += parseInt(body.targetTonne)
      e.startingValue += parseInt(body.targetValue)
      e.startingTonne += parseInt(body.targetTonne)
      await WardAdminRole.updateMany({ b2bUserId: e.b2bUserId }, { date: serverdate, time: time, targetValue: e.targetValue, targetTonne: e.targetTonne, startingValue: e.startingValue, startingTonne: e.startingTonne }, { new: true })
    });
  }
  else {
    values = {
      ...body,
      ...{ date: serverdate, time: time, startingValue: parseInt(body.targetValue), startingTonne: parseInt(body.targetTonne), },
    }
    await WardAdminRole.create(values)
  }

  // const value = await WardAdminRole.find({b2bUserId:body.b2bUserId, unit:body.unit});
  // if(value.length == 0)
  // {
  //   values = {
  //     ...body,
  //     ...{ date: serverdate, time: time, startingValue: parseInt(body.targetValue), startingTonne: parseInt(body.targetTonne), targetValue:parseInt(body.targetValue), targetTonne: parseInt(body.targetTonne)  },
  //   };

  //    await WardAdminRole.create(values);
  // }else{
  //   if(body.unit == "KG"){
  //   value.forEach(async (e) => {

  //     if(e.unit == "KG"){
  //   e.targetValue += parseInt(body.targetValue)
  //   e.targetTonne += parseInt(body.targetTonne)
  //   e.startingValue += parseInt(body.targetValue)
  //   e.startingTonne += parseInt(body.targetTonne) 
  //   await WardAdminRole.updateMany({b2bUserId:e.b2bUserId, unit:'KG'},{date: serverdate, time: time, targetValue:e.targetValue, targetTonne:e.targetTonne, startingValue:e.startingValue, startingTonne:e.startingTonne }, { new: true })  
  // }
  // });
  //     }else{
  //       value.forEach(async (e) => {
  //         if(e.unit == "Tonne"){
  //       e.targetValue += parseInt(body.targetValue)
  //       e.targetTonne += parseInt(body.targetTonne)
  //       e.startingValue += parseInt(body.targetValue)
  //       e.startingTonne += parseInt(body.targetTonne)  
  //       await WardAdminRole.updateMany({b2bUserId:e.b2bUserId, unit:'Tonne'},{date: serverdate, time: time, targetValue:e.targetValue, targetTonne:e.targetTonne, startingValue:e.startingValue, startingTonne:e.startingTonne }, { new: true })
  //         }
  //     });
  // }
  // }

  return { message: "created" };
};

// telecallerHead

const telecallerHead  = async () => {
  console.log("e2gr")
  const data = await Users.aggregate([
    {
      $match: {
        $and: [{ userRole: { $eq: "ae601146-dadd-443b-85b2-6c0fbe9f964c" }}],
      },
    }, 
    {
      $project: {
        name:1,
        phoneNumber:1,
        userRole:1,
      },
    },  
  ])
  return data;
};

const createwithAsmwithoutAsm = async (body) => {
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  let values1 = {
    ...body,
    ...{ date: serverdate, time: time },
  }
  const data = await WithoutAsmWithAsm.create(values1)
  return data;
};

// get withwithoutData

const getwithAsmwithoutAsm = async (type, date) => {
  // let type = "withAsm"
  // let type = "withoutAsm"
  let match;
  if (date != 'null') {
    match = [{ date: { $eq: date } }, { status: { $eq: type } }];
  } else {
    match = [{ status: { $eq: type } }];
  }
  const data = await WithoutAsmWithAsm.aggregate([
    {
      $match: {
        $and: match,
      },
    },
    // {
    //   $lookup: {
    //     from: 'b2busers',
    //     localField: '_id',
    //     foreignField: 'wardAdminId',
    //     as: 'b2busersData',
    //   },
    // },
    // {
    //   $unwind: '$b2busersData',
    // },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'salesman',
        foreignField: '_id',
        as: 'b2busersDataSales',
      },
    },
    {
      $unwind: '$b2busersDataSales',
    },
    {
      $project: {
        Salesmanname: '$b2busersDataSales.name',
        // Asmname:"$b2busersData.name",
        targetTonne: 1,
        targetValue: 1,
        salesman: 1,
        wardAdminId: 1,
        status: 1,
        unit: 1,
        date: 1,
        time: 1,
        _id: 1,
      },
    },
  ])
  return data
};

const getwithAsmwithoutAsm1 = async (type, date) => {
  // let type = "withAsm"
  // let type = "withoutAsm"
  let match;
  if (date != 'null') {
    match = [{ date: { $eq: date } }, { status: { $eq: type } }];
  } else {
    match = [{ status: { $eq: type } }];
  }
  const data = await WithoutAsmWithAsm.aggregate([
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'wardAdminId',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    {
      $unwind: '$b2busersData',
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'salesman',
        foreignField: '_id',
        as: 'b2busersDataSales',
      },
    },
    {
      $unwind: '$b2busersDataSales',
    },
    {
      $project: {
        Salesmanname: '$b2busersDataSales.name',
        Asmname: "$b2busersData.name",
        targetTonne: 1,
        targetValue: 1,
        salesman: 1,
        wardAdminId: 1,
        status: 1,
        unit: 1,
        date: 1,
        time: 1,
        _id: 1,
      },
    },
  ])
  return data
};

const getAllWithAsmwithout = async (sm, asm, date) => {
  let match;
  if (sm != 'null' && asm == 'null' && date == 'null') {
    match = [{ salesman: { $eq: sm } }, { status: { $eq: "withoutAsm" } }];
  }
  else if (sm != 'null' && asm == 'null' && date != 'null') {
    match = [{ salesman: { $eq: sm } }, { date: { $eq: date } }, { status: { $eq: "withoutAsm" } }];
  } else if (sm = 'null' && asm != 'null' && date == 'null') {
    match = [{ wardAdminId: { $eq: asm } }, { status: { $eq: "withAsm" } }];
  } else if (sm = 'null' && asm != 'null' && date != 'null') {
    match = [{ wardAdminId: { $eq: asm } }, { date: { $eq: date } }, { status: { $eq: "withAsm" } }];
  } else if (sm != 'null' && asm != 'null' && date == 'null') {
    match = [{ wardAdminId: { $eq: asm } }, { salesman: { $eq: sm } }, { status: { $eq: "withAsm" } }];
  } else if (sm != 'null' && asm != 'null' && date != 'null') {
    match = [{ wardAdminId: { $eq: asm } }, { salesman: { $eq: sm } }, { date: { $eq: date } }, { status: { $eq: "withAsm" } }];
  }
  else {
    match = [{ active: { $eq: true } }];
  }
  const data = await WithoutAsmWithAsm.aggregate([
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'wardAdminId',
        foreignField: '_id',
        as: 'b2busersData',
      },
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'salesman',
        foreignField: '_id',
        as: 'b2busersDataSales',
      },
    },
    {
      $project: {
        Salesmanname: '$b2busersDataSales.name',
        Asmname: "$b2busersData.name",
        targetTonne: 1,
        targetValue: 1,
        salesman: 1,
        wardAdminId: 1,
        status: 1,
        unit: 1,
        date: 1,
        time: 1,
        _id: 1,
      },
    },
  ])
  return data
};


const getAll = async (date) => {
  if (date != 'null') {
    match = [{ date: { $eq: date } }];
  } else {
    match = [{ active: { $eq: true } }];
  }
  const data = await WardAdminRole.aggregate([
    { $sort: { date: -1 } },
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
      $project: {
        name: '$Asmb2busersData.name',
        targetTonne: 1,
        targetValue: 1,
        b2bUserId: 1,
        startingValue: 1,
        startingTonne: 1,
        unit: 1,
        date: 1,
        time: 1,
        _id: 1,
      },
    },
  ]);
  return data;
};

// const get_All_tones_and_values = async (id) =>{
//    const data = await WardAdminRole.aggregate([
//     {
//       $match: {
//         $and: [{ b2bUserId: { $eq: id } }],
//       },
//     },
//    ])
// }
const getWardAdminRoleById = async (id) => {
  const data = await WardAdminRole.findById(id);
  if (!data || data.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wardAdminRole Not Found');
  }
  return data;
};

const createwardAdminRoleAsm = async (body) => {
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  let values = {};
  values = { ...body, ...{ date: serverdate, time: time } };
  const data = await WardAdminRoleAsm.create(values);
  return data;
};

const WardAdminRoleAsmHistorydata = async (body) => {
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  let values = {};
  values = {
    ...body,
    ...{ date: serverdate, time: time, targetValue: parseInt(body.targetValue), targetTonne: parseInt(body.targetTonne) },
  };

  await WardAdminRoleAsm.create(values);

  const value = await WardAdminRoleAsmHistory.find({ b2bUserId: body.b2bUserId, unit: body.unit });
  if (value != 0) {
    if (body.unit == "KG") {
      value.forEach(async (e) => {

        if (e.unit == "KG") {
          e.targetValue += parseInt(body.targetValue)
          e.targetTonne += parseInt(body.targetTonne)
          await WardAdminRoleAsmHistory.updateMany({ b2bUserId: e.b2bUserId, unit: 'KG' }, { date: serverdate, time: time, targetValue: e.targetValue, targetTonne: e.targetTonne }, { new: true })
        }
      });
    } else {
      value.forEach(async (e) => {
        if (e.unit == "Tonne") {
          e.targetValue += parseInt(body.targetValue)
          e.targetTonne += parseInt(body.targetTonne)
          await WardAdminRoleAsmHistory.updateMany({ b2bUserId: e.b2bUserId, unit: 'Tonne' }, { date: serverdate, time: time, targetValue: e.targetValue, targetTonne: e.targetTonne }, { new: true })
        }
      });
    }
  }
  return { data: "created or else updated asmtone and value" };
};

const getAllWardAdminRoleData = async (id) => {
  let data = await WardAdminRole.aggregate([
    {
      $match: {
        $and: [{ b2bUserId: { $eq: id } }],
      },
    },
  ]);
  return data;
};

// const getAllWardAdminRoleDataCurrent = async (id) => {

//   let data = await WardAdminRole.aggregate([
//     {
//       $match: {
//         $and: [{ b2bUserId: { $eq: id } }],
//       },
//     },
//   ]);
//   return data;
// };

const smData = async (date) => {
  let match;
  if (date != 'null') {
    match = [{ 'wardadminroleasmsData.date': { $eq: date } }];
  } else {
    match = [{ 'wardadminroleasmsData.active': { $eq: true } }];
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
        localField: 'b2bUserId',
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
    { $sort: { 'wardadminroleasmsData.date': -1 } },
    {
      $project: {
        salesmanName: '$b2busersData.name',
        targetValue: '$wardadminroleasmsData.targetValue',
        targetTonne: '$wardadminroleasmsData.targetTonne',
        // wardAdminId:'$wardadminroleasmsData.wardAdminId',
        b2buserId: '$wardadminroleasmsData.salesman',
        date: '$wardadminroleasmsData.date',
        time: '$wardadminroleasmsData.time',
        Asm: '$Asmb2busersData.name',
        _id: 1,
      },
    },
  ]);
  return data;
};

const total = async (id, updateBody) => {
  const values = await WardAdminRole.find({ b2bUserId: id })
  if (values.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'wardAdminRole not found');
  }
  values.forEach(async (e) => {
    let value = parseInt(updateBody.targetValue);
    let tone = parseInt(updateBody.targetTonne);
    let asmvalue = e.targetValue;
    let asmtone = e.targetTonne;
    let value1 = asmvalue - value;
    let tone1 = asmtone - tone;
    await WardAdminRole.updateMany({ b2bUserId: id }, { targetValue: value1, targetTonne: tone1 }, { new: true });
  })
  //  const values = await WardAdminRole.find({b2bUserId:id})
  // if(values != 0){
  //   if(updateBody.unit == "KG"){
  //   values.forEach(async (e) => {
  //     if(e.unit == "KG"){
  //   let value = parseInt(updateBody.targetValue);
  //   let tone = parseInt(updateBody.targetTonne);
  //   let asmvalue = e.targetValue;
  //   let asmtone = e.targetTonne;
  //   let value1 = asmvalue - value;
  //   let tone1 = asmtone - tone;

  //     await WardAdminRole.updateMany({ b2bUserId: id, unit:"KG"}, { targetValue: value1, targetTonne: tone1 }, { new: true });
  //     }
  //    })
  //   }else{
  //     values.forEach(async (e) => {
  //       if(e.unit == "Tonne"){
  //     let value = parseInt(updateBody.targetValue);
  //     let tone = parseInt(updateBody.targetTonne);
  //     let asmvalue = e.targetValue;
  //     let asmtone = e.targetTonne;
  //     let value1 = asmvalue - value;
  //     let tone1 = asmtone - tone;

  //      await WardAdminRole.updateMany({ b2bUserId: id, unit:"Tonne"}, { targetValue: value1, targetTonne: tone1 }, { new: true });
  //       }
  //      })
  //   }
  // }else{
  //   throw new ApiError(httpStatus.NOT_FOUND, 'wardAdminRole not found');
  // }
  return { message: "updated" }
};

// getAllSalesMandataCurrentdate
const getAllSalesMandataCurrentdate = async (id) => {
  let serverdate = moment().format('yyy-MM-DD');
  const data = await WardAdminRoleAsm.find({ salesman: id, active: true, date: serverdate });
  return data;
};

const createAsmSalesman = async (body) => {
  let { arr } = body;
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  if (body.status == 'Assign') {
    arr.forEach(async (e) => {
      await Users.findByIdAndUpdate({ _id: e }, { salesManagerStatus: body.status }, { new: true });
      await AsmSalesMan.create({
        asmId: body.asmId,
        salesManId: e,
        status: body.status,
        date: serverdate,
        time: time,
        date: serverdate,
      });
    });
  } else {
    arr.forEach(async (e) => {
      let data = await AsmSalesMan.find({ asmId: body.asmId, salesManId: e, status: 'Assign' });
      data.forEach(async (f) => {
        await Users.findByIdAndUpdate({ _id: f.salesManId }, { salesManagerStatus: body.status }, { new: true });
        await AsmSalesMan.findByIdAndUpdate(
          { _id: f._id },
          { asmId: f.asmId, salesManId: f.salesManId, status: body.status, reAssignDate: serverdate, reAssignTime: time },
          { new: true }
        );
      });
    });
  }
  return 'created';
};

const getAsmSalesman = async (id) => {
  const name = await Users.findById(id)
  let data = await AsmSalesMan.aggregate([
    {
      $match: {
        $and: [{ asmId: { $eq: id } }, { status: { $eq: 'Assign' } }],
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
      $lookup: {
        from: 'salesmanshops',
        let: {
          localField: '$salesManId',
        },
        pipeline: [{ $match: { $expr: { $eq: ['$salesManId', '$$localField'] } } },
        {
          $match: {
            $and: [{ status: { $ne: "Reassign" } }],
          },
        },
        ],
        as: 'b2bshopclonesdata',
      },
    },
    {
      $project: {
        salesmanName: '$b2busersData.name',
        salesManId: 1,
        status: 1,
        asmId: 1,
        date: 1,
        time: 1,
        _id: 1,
        Count: { $size: "$b2bshopclonesdata" },
      },
    },
  ]);
  return { data: data, name: name.name };
};

const allAssignReassignSalesman = async (id) => {
  const data = await AsmSalesMan.aggregate([
    {
      $match: {
        $and: [{ asmId: { $eq: id } }],
      },
    },
  ]);
  return data;
};

const createSalesmanShop = async (body) => {
  let { arr } = body;
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  if (body.status == 'Assign') {
    arr.forEach(async (e) => {
      await Shop.findByIdAndUpdate({ _id: e }, { salesManStatus: body.status }, { new: true });
      await SalesManShop.create({
        salesManId: body.salesManId,
        shopId: e,
        status: body.status,
        date: serverdate,
        fromSalesManId: body.fromSalesManId,
        time: time,
        date: serverdate,
      });
    });
  } else {
    arr.forEach(async (e) => {
      let data = await SalesManShop.find({ salesManId: body.salesManId, shopId: e, status: 'Assign' });
      data.forEach(async (f) => {
        await Shop.findByIdAndUpdate({ _id: f.shopId }, { salesManStatus: body.status }, { new: true });
        await SalesManShop.findByIdAndUpdate(
          { _id: f._id },
          {
            salesManId: f.salesManId,
            fromSalesManId: f.fromSalesManId,
            shopId: f.shopId,
            status: body.status,
            reAssignDate: serverdate,
            reAssignTime: time,
          },
          { new: true }
        );
      });
    });
  }
  return 'created';
};

const getSalesman = async (id) => {
  const name = await Users.findById(id)
  let data = await SalesManShop.aggregate([
    {
      $match: {
        $or: [
          { $and: [{ fromSalesManId: { $eq: id } }, { status: { $eq: "Assign" } }] },
          { $and: [{ salesManId: { $eq: id } }, { status: { $eq: 'tempReassign' } }] },
        ],
      }
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
        shopname: '$b2bshopclonesData.SName',
        salesmanName: '$b2busersData.name',
        salesManId: 1,
        fromSalesManId: 1,
        shopId: 1,
        ward: '$wardsData.ward',
        zone: '$zonesData.zone',
        status: 1,
        reAssignDate: 1,
        reAssignTime: 1,
        date: 1,
        time: 1,
        _id: 1,
      },
    },
  ]);
  return { data: data, salesmanname: name.name };
};

// withoutoutAsmSalesman
const createwithoutoutAsmSalesman = async (body) => {
  let serverdate = moment().format('yyy-MM-DD');
  let time = moment().format('hh:mm a');
  let values = {};
  values = { ...body, ...{ date: serverdate, time: time } };
  const data = await WithoutAsmSalesman.create(values);
  return data;
};

//withoutoutAsmSalesmanCurrentDate
const withoutoutAsmSalesmanCurrentDate = async (id) => {

  let serverdate = moment().format('yyy-MM-DD');
  const data = await WithoutAsmWithAsm.find({ salesman: id, date: serverdate, status: "withoutAsm" });
  return data;
};

const withoutoutAsmSalesman = async (date) => {
  let match;
  if (date != 'null') {
    match = [{ date: { $eq: date } }];
  } else {
    match = [{ active: { $eq: true } }];
  }
  const data = await WithoutAsmSalesman.aggregate([
    {
      $match: {
        $and: match,
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
        salesmanName: '$b2busersData.name',
        targetTonne: 1,
        targetValue: 1,
        salesman: 1,
        unit: 1,
        date: 1,
        time: 1,
        _id: 1,
      },
    },
  ]);
  return data;
};

const dataAllSalesManhistry = async (id) => {
  let data = await SalesManShop.aggregate([
    {
      $match: {
        $and: [{ salesManId: { $eq: id } }],
      },
    },
  ]);

  return data;
};

const allocateDealocateCount = async (id) => {
  let data = await Users.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
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
        pipeline: [
          {
            $match: {
              $and: [{ status: { $eq: 'Assign' } }],
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
        pipeline: [
          {
            $match: {
              $and: [{ status: { $eq: 'Reassign' } }],
            },
          },
        ],
        as: 'salesmanshopsReassign',
      },
    },
    { $sort: { 'salesmanshopsData.date': -1 } },
    {
      $project: {
        assignCount: { $size: '$salesmanshopsAssign' },
        reassignCount: { $size: '$salesmanshopsReassign' },
        date: '$salesmanshopsData.date',
        //  sum:{ $subtract:[{$size:"salesmanshopsReassign"},{$size:"salesmanshopsReassign"}]}
      },
    },
  ]);
  return data;
};

const createtemperaryAssigndata = async (body) => {
  let serverdate = moment().format('YYYY-MM-DD');
  let time = moment().format('hh:mm a');
  body.arr.forEach(async (e) => {
    let data = await SalesManShop.find({ shopId: e });
    console.log(data);
    if (data.length != 0) {
      data.forEach(async (f) => {
        await Shop.findByIdAndUpdate({ _id: f.shopId }, { salesManStatus: body.status }, { new: true });
        console.log(f._id);
        await SalesManShop.findByIdAndUpdate(
          { _id: f._id },
          {
            salesManId: body.salesManId,
            shopId: f.shopId,
            status: body.status,
            reAssignDate: serverdate,
            reAssignTime: time,
          },
          { new: true }
        );
      });
    } else {
      body.arr.forEach(async (e) => {
        await SalesManShop.create({
          shopId: e,
          status: body.status,
          salesManId: body.salesManId,
          date: serverdate,
          time: time,
        });
      });
    }
  });

  return { data: 'created' };
};

const getAllTempReassigndata = async () => {
  const data = await SalesManShop.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: 'tempReassign' } }],
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
      $project: {
        SName: '$b2bshopclonesData.SName',
        mobile: '$b2bshopclonesData.mobile',
        address: '$b2bshopclonesData.address',
      },
    },
  ]);

  return data;
};

const getAssignData_by_SalesMan = async (page) => {
  let values = await Users.aggregate([
    {
      $match: {
        $and: [{ userRole: { $eq: 'fb0dd028-c608-4caa-a7a9-b700389a098d' } }],
      },
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: '_id',
        foreignField: 'salesManId',
        pipeline: [
          {
            $match: {
              $and: [{ status: { $ne: 'Reassign' } }],
            },
          },
        ],
        as: 'salesMan',
      },
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: '_id',
        foreignField: 'salesManId',
        pipeline: [
          {
            $match: {
              $and: [{ status: { $ne: 'Reassign' } }, { status: { $ne: 'Assign' } }, { status: { $eq: 'tempReassign' } }],
            },
          },
        ],
        as: 'salesMandata',
      },
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: '_id',
        foreignField: 'fromSalesManId',
        pipeline: [
          {
            $match: {
              $and: [{ status: { $ne: 'Reassign' } }, { status: { $ne: 'Assign' } }, { status: { $eq: 'tempReassign' } }],
            },
          },
        ],
        as: 'salesmanshopsdata',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phoneNumber: 1,
        userRole: 1,
        fromSalesManId: '$saleMan.fromSalesManId',
        no_of_shop: { $size: '$salesMan' },
        no_of_temperory: { $size: "$salesMandata" },
        temp: { $size: '$salesmanshopsdata' },
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await Users.aggregate([
    {
      $match: {
        $and: [{ userRole: { $eq: 'fb0dd028-c608-4caa-a7a9-b700389a098d' } }],
      },
    },
    {
      $lookup: {
        from: 'salesmanshops',
        localField: '_id',
        foreignField: 'salesManId',
        as: 'salesMan',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phoneNumber: 1,
        userRole: 1,
        no_of_shop: { $size: '$salesMan' },
      },
    },
  ]);
  return { values: values, total: total.length };
};

const get_Assign_data_By_SalesManId = async (id) => {
  let values = await SalesManShop.aggregate([
    // {
    //   $match: { salesManId: id },
    // },
    {
      $match: {
        $and: [{ salesManId: { $eq: id } }, { status: { $ne: 'Reassign' } }],
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
        from: 'b2busers',
        localField: 'salesManId',
        foreignField: '_id',
        as: 'Users',
      },
    },
    {
      $unwind: '$Users',
    },
    {
      $project: {
        _id: 1,
        archive: 1,
        active: 1,
        salesManId: 1,
        shopId: 1,
        fromSalesManId: 1,
        status: 1,
        date: 1,
        time: 1,
        reAssignDate: 1,
        reAssignTime: 1,
        shops: '$b2bshopclonesData.SName',
        salesMan: '$Users.name',
      },
    },
  ]);
  return values;
};

const getUsersWith_skiped = async (id) => {
  let values = await Users.aggregate([
    {
      $match: {
        $and: [{ _id: { $ne: id } }, { userRole: { $eq: 'fb0dd028-c608-4caa-a7a9-b700389a098d' } }],
      },
    },
<<<<<<< HEAD
    // {
    //   $lookup: {
    //     from: 'salesmanshops',
    //     localField: '_id',
    //     foreignField: 'salesManId',
    //     as: 'salesmanshopsData',
    //   },
    // },
    // {
    //   $unwind: '$salesmanshopsData',
    // },
=======
    {
      $lookup: {
        from: 'salesmanshops',
        localField: '_id',
        foreignField: 'fromSalesManId',
        pipeline: [
          { $match: { status: "tempReassign",salesManId:id } }
        ],
        as: 'salesmanshops',
      },
    },
    {
      $project: {
        salesmanshops: { $size: "$salesmanshops" },name:1
      }
    },
    {
      $match: {
        salesmanshops: { $eq: 0 }
      }
    }
>>>>>>> b34730189ff02dfad0d9c5c82356703dcc49d12e

  ]);

  return values;
};

const getDataAll = async () => {
  let values = await Users.aggregate([
    {
      $match: {
        $and: [{ userRole: { $eq: 'fb0dd028-c608-4caa-a7a9-b700389a098d' } }],
      },
    },
  ]);
  return values;
};

const Return_Assign_To_SalesMan = async (id) => {
  let currentDate = moment().format('YYYY-MM-DD');
  let currentTime = moment().format('hh:mm a');
  await SalesManShop.updateMany(
    { fromSalesManId: id, status: 'tempReassign' },
    { $set: { status: 'Assign', salesManId: id, date: currentDate, time: currentTime } },
    { new: true }
  );
  return { Message: 'Successfully Re-Assigned to SalesMan' };
};

const history_Assign_Reaasign_data = async (id, date, idSearch, tempid) => {
  const name = await Users.findById(id)
  let match;
  if (date != 'null' && idSearch == 'null' && tempid == 'null') {
    match = {
      $or: [
        { $and: [{ fromSalesManId: { $eq: id } }, { status: { $eq: "Assign" } }, { date: { $eq: date } }] },
        { $and: [{ salesManId: { $eq: id } }, { status: { $eq: 'tempReassign' } }, { reAssignDate: { $eq: date } }] },
      ],
    }
  }
  else if (tempid != 'null' && date == 'null' && idSearch == 'null') {
    match = {
      $or: [
        // { $and: [{ fromSalesManId: {$eq:id } }, { status: {$eq:"tempReassign"} }, {tempid:{$eq:tempid}}] },
        { $and: [{ salesManId: { $eq: id } }, { status: { $eq: 'tempReassign' } }, { fromSalesManId: { $eq: tempid } }] },
      ],
    }
  }
  else if (tempid != 'null' && date != 'null' && idSearch == 'null') {
    match = {
      $or: [
        // { $and: [{ fromSalesManId: {$eq:id } }, { status: {$eq:"tempReassign"} }, {tempid:{$eq:tempid}}] },
        { $and: [{ salesManId: { $eq: id } }, { status: { $eq: 'tempReassign' } }, { reAssignDate: { $eq: date } }, { fromSalesManId: { $eq: tempid } }] },
      ],
    }
  }
  else if (date != 'null' && idSearch != 'null' && tempid == 'null') {
    match = {
      $or: [
        { $and: [{ fromSalesManId: { $eq: id } }, { status: { $eq: "Assign" } }, { date: { $eq: date } }, { salesManId: { $eq: idSearch } }] },
        { $and: [{ salesManId: { $eq: id } }, { status: { $eq: 'tempReassign' } }, { reAssignDate: { $eq: date } }, { fromSalesManId: { $eq: idSearch } }] },
      ],
    }
  } else if (date == 'null' && idSearch != 'null' && tempid == 'null') {
    match = {
      $or: [
        { $and: [{ fromSalesManId: { $eq: id } }, { status: { $eq: "Assign" } }, { salesManId: { $eq: idSearch } }] },
        { $and: [{ salesManId: { $eq: id } }, { status: { $eq: 'tempReassign' } }, { fromSalesManId: { $eq: idSearch } }] },
      ],
    }
  } else {
    match = {
      $or: [
        { $and: [{ fromSalesManId: { $eq: id } }, { status: { $eq: "Assign" } },] },
        { $and: [{ salesManId: { $eq: id } }, { status: { $eq: 'tempReassign' } }] },
      ],
    }
  }
  // console.log(match)
  const data = await SalesManShop.aggregate([
    {
      $match: match
    },

    {
      $lookup: {
        from: 'b2busers',
        localField: 'fromSalesManId',
        foreignField: '_id',
        as: 'Users',
      },
    },
    {
      $unwind: '$Users',
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'b2bshopclonesdata',
      },
    },
    {
      $unwind: '$b2bshopclonesdata',
    },
    {
      $project: {
        salesMan: '$Users.name',
        salesManId: 1,
        shopId: 1,
        status: 1,
        date: 1,
        fromSalesManId: 1,
        time: 1,
        reAssignDate: 1,
        reAssignTime: 1,
        shopname: '$b2bshopclonesdata.SName'
      }
    }

  ])
  return { data, name: name.name };
}

const getAllSalesmanShopsCount = async () => {
  const data = await Users.aggregate([
    // {
    {
      $match: {
        $and: [{ userRole: { $eq: 'fb0dd028-c608-4caa-a7a9-b700389a098d' } }]
      }
    },
    {
      $lookup: {
        from: 'salesmanshops',
        let: {
          localField: '$_id',
        },
        pipeline: [{ $match: { $expr: { $eq: ['$salesManId', '$$localField'] } } },
        {
          $match: {
            $and: [{ status: { $ne: "Reassign" } }],
          },
        },
        ],
        as: 'b2bshopclonesdata',
      },
    },
    // {
    //   $unwind: '$b2bshopclonesdata',
    // },
    {
      $project: {

        Count: { $size: "$b2bshopclonesdata" },
      }
    }

  ])
  return data;
}

const getAllSalesmanShopsData = async (id) => {

  const data = await SalesManShop.aggregate([
    // {
    {
      $match: {
        $or: [
          { $and: [{ fromSalesManId: { $eq: id } }, { status: { $eq: "Assign" } }] },
          { $and: [{ salesManId: { $eq: id } }, { status: { $eq: 'tempReassign' } }] },
        ],
      }
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'b2bshopclonesdata',
      },
    },
    {
      $unwind: '$b2bshopclonesdata',
    },
    {
      $project: {
        shopName: "$b2bshopclonesdata.SName",
        shopOwner: "$b2bshopclonesdata.SOwner",
        mobileNumber: "$b2bshopclonesdata.mobile",
        status: 1,
        date: 1,
        time: 1,
        reAssignDate: 1,
        reAssignTime: 1,
        shopId: 1,
        salesManId: 1,
        fromSalesManId: 1,
      }
    }

  ])
  return data;
}

const getAllAsmCurrentdata = async (id) => {
  let serverdate = moment().format('YYYY-MM-DD');
  const data = await WardAdminRoleHistory.aggregate([
    {
      $match: {
        $and: [{ b2bUserId: { $eq: id } }, { date: { $eq: serverdate } }],
      },
    },
  ])
  return data;

}

const WardAdminRoleHistor = async (id, date) => {
  let match;
  if (id != 'null' && date == 'null') {
    match = {
      $and: [{ b2bUserId: { $eq: id } }]
    }
  } else if (id == 'null' && date != 'null') {
    match = {
      $and: [{ date: { $eq: date } }]
    }
  }
  else if (id != 'null' && date != 'null') {
    match = {
      $and: [{ b2bUserId: { $eq: id } }, { date: { $eq: date } }]
    }
  } else {
    match = {
      $and: [{ active: { $eq: true } }]
    }
  }

  const data = await WardAdminRoleHistory.aggregate([
    {
      $match: match
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'b2bUserId',
        foreignField: '_id',
        as: 'b2busersdata',
      },
    },
    {
      $unwind: '$b2busersdata',
    },
    {
      $project: {
        Name: "$b2busersdata.name",
        targetTonne: 1,
        date: 1,
        time: 1,
        targetValue: 1,
        b2bUserId: 1,
      }
    }
  ])
  return data;

}

const asmdata = async () => {
  const data = await Users.aggregate([
    {
      $match: {
        $and: [{ userRole: { $eq: '719d9f71-8388-4534-9bfe-3f47faed62ac' } }]
      }
    },
    {
      $project: {
        name: 1,
        //  targetTonne:1,
        //  date:1,
        //  time:1,
        //  targetValue:1,
        //  b2bUserId:1,
      }
    }
  ])
  return data;
}

const asmSalesman = async (id) => {
  const data = await AsmSalesMan.aggregate([
    {
      $match: {
        $and: [{ asmId: { $eq: id } }, { status: { $eq: "Assign" } }]
      }
    },
    {
      $lookup: {
        from: 'b2busers',
        localField: 'salesManId',
        foreignField: '_id',
        as: 'b2busersdata',
      },
    },
    {
      $unwind: '$b2busersdata',
    },
    {
      $project: {
        name: "$b2busersdata.name",
        salesManId: 1,
      }
    }

  ])
  return data;

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
  createtemperaryAssigndata,
  getAllTempReassigndata,
  getAssignData_by_SalesMan,
  get_Assign_data_By_SalesManId,
  getUsersWith_skiped,
  Return_Assign_To_SalesMan,
  history_Assign_Reaasign_data,
  WardAdminRoleAsmHistorydata,
  getAllSalesmanShopsCount,
  getAllSalesmanShopsData,
  getDataAll,
  getAllAsmCurrentdata,
  createwithAsmwithoutAsm,
  createwithAsmwithoutAsm,
  getwithAsmwithoutAsm,
  getwithAsmwithoutAsm1,
  WardAdminRoleHistor,
  getAllWithAsmwithout,
  asmdata,
  asmSalesman,
  telecallerHead,
};
