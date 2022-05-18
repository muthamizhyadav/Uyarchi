const httpStatus = require('http-status');
const { Apartment, Shop ,ManageUserAttendance, ManageUserAttendanceAuto} = require('../models/apartmentTable.model');
const manageUser = require('../models/manageUser.model')
const ApiError = require('../utils/ApiError');
const Street = require('../models/street.model')

const createApartment = async (apartmentBody) => {
    const {Uid} = apartmentBody;
    console.log(apartmentBody)
    let ManageUser = await manageUser.findById(Uid);
    let values = {}
    values = {...apartmentBody, ...{Uid:ManageUser.id}}
    if(ManageUser === null){
      throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
    }
    console.log(values)
    return Apartment.create(values)
};

const createManageUserAutoAttendance = async (manageUserAttendanceAutoBody) => {
  const {Uid} = manageUserAttendanceAutoBody;
  let ManageUser = await manageUser.findById(Uid);
  let values = {}
  values = {...manageUserAttendanceAutoBody, ...{Uid:ManageUser.id}}
  if(ManageUser === null){
    throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
  }
  console.log(values)
  return ManageUserAttendanceAuto.create(values)
};


const getAllManageUserAutoAttendance = async () => {
    const user = ManageUserAttendanceAuto.find({ active: true });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'ManageUserAttendanceAuto Not Found');
    }
    return user;
  };


  const getAllManageUserAutoAttendanceTable = async (id,date,page) => {
    let match;
    if(id !='null'&&date !='null'){
       match=[{ Uid: { $eq: id }},{ date: { $eq: date }},{active:{$eq:true}}];
    }else if(id != 'null'){
      match=[{ Uid: { $eq: id }},{active:{$eq:true}}]
    }else{
      match=[{ Uid: { $ne: null }},{active:{$eq:true}}]
    }
    const user = await ManageUserAttendanceAuto.aggregate([
      {
        $match: {
          $and: match,
        },
      },
      {
        $lookup:{
          from: 'manageusers',
          localField: 'Uid',
          foreignField: '_id',
          as: 'manageusersdata',
        }
      },
      {
        $unwind:'$manageusersdata'
      },
      {
        $project: {
          userName:'$manageusersdata.name',
          mobileNumber:"$manageusersdata.mobileNumber",
          id:1,
          date:1,
          time:1,
          Alat:1,
          Along:1,
          photoCapture:1,
          baseImage:1,
          created:1,
          Uid:1
  
        },
      },
      {
        $skip:10*parseInt(page)
      },
     {
        $limit:10
      },
      // { $sort : { date : -1, time: -1 ,_id:-1} }
      
    ]);
    const count=await ManageUserAttendanceAuto.aggregate([
      {
        $match: {
          $and: match,
        },
      },
    ]);
    return {
      data:user,
      count:count.length
    } 
  };

const apartmentAggregation = async ()=>{
  return Apartment.aggregate([
    {
      $lookup: {
        from: 'street',
        localField: 'Strid',
        foreignField: '_id',
        as: 'apartmentData',
      },
    },
    {
      $unwind: '$apartmentData',
    },
    {
      $lookup: {
        from: 'shops',
        localField: 'Strid',
        foreignField: 'Strid',
        as: 'shopData',
      },
    },
    {
      $unwind: '$shopData',
    },
    {
      $project: {
        ApartMent:"$apartmentData",
        // ShopData:"$shopData"
      },
    },
  ])
}

const createManageUserAttendance = async (manageUserAttendanceBody) => {
  const {Uid} = manageUserAttendanceBody;
  let ManageUser = await manageUser.findById(Uid);
  let values = {}
  values = {...manageUserAttendanceBody, ...{Uid:ManageUser.id,}}
  if(ManageUser === null){
    throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
  }
  console.log(values)
  return ManageUserAttendance.create(values)
};
// const paginationManageUserAttendance = async (filter, options) => {
//   return ManageUserAttendance.paginate(filter, options);
// };
const getAllManageUSerAttendance = async (id,date,fromtime,totime,page)=>{
  let match;
  if(id !='null'&&date !='null'&&fromtime !='null'&&totime!='null'){
     match=[{ Uid: { $eq: id }},{ date: { $eq: date }},{ time:{ $gte: fromtime,$lte: totime}},{active:{$eq:true}}];
     console.log("k,hyu")
  }
  else if(id !='null'&&date =='null'&&fromtime =='null'&&totime =='null'){
     match=[{ Uid: { $eq: id }},{active:{$eq:true}}]
  }
  else if(id =='null'&&date !='null'&&fromtime =='null'&& totime =='null'){
     match=[{ date: { $eq: date }},{active:{$eq:true}}]
  }
  else if(id =='null'&&date =='null'&fromtime !='null'&& totime !='null'){
     match=[{ time:{ $gte: fromtime}},{ time:{$lte: totime}},{active:{$eq:true}}]
  }
  else if(id =='null'&&date !='null'&&fromtime !='null'&& totime != 'null'){
     match=[{ date: { $eq: date }},{ time:{ $gte: fromtime,$lte: totime}},{active:{$eq:true}}]
  }
  else if(id !='null'&&date =='null'&&fromtime !='null'&& totime!='null'){
     match=[{ Uid: { $eq: id }},{ time:{ $gte: fromtime,$lte: totime}},{active:{$eq:true}}]
  }
  else if(id !='null'&&date !='null'&&fromtime =='null'&&totime == 'null'){
     match=[{ Uid: { $eq: id }},{ date: { $eq: date }},{active:{$eq:true}}]
  }
  else {
    match=[{ Uid: { $ne: null }},{active:{$eq:true}}]
  }
  console.log(match)
  const Attendance= await ManageUserAttendance.aggregate([
    {
      $match: {
        $and: match,
      },
    },
    {
      $lookup:{
        from: 'manageusers',
        localField: 'Uid',
        foreignField: '_id',
        as: 'manageusersdata',
      }
    },
    {
      $unwind:'$manageusersdata'
    },
    {
      $project: {
        userName:'$manageusersdata.name',
        mobileNumber:"$manageusersdata.mobileNumber",
        id:1,
        date:1,
        time:1,
        Alat:1,
        Along:1,
        photoCapture:1,
        created:1,
        Uid:1

      },
    },
    {
      $skip:10*parseInt(page)
    },
   {
      $limit:10
    },
    { $sort : { date : -1, time: -1 ,_id:-1} }
    
  ]);
  const count=await ManageUserAttendance.aggregate([
    {
      $match: {
        $and: match,
      },
    },
  ]);

  console.log(Attendance)

  return {
    data:Attendance,
    count:count.length
  }

}

const getSearch = async (manageUserAttendanceBody) => {
  console.log(manageUserAttendanceBody)
  let ManageUser = await manageUser.find({name:manageUserAttendanceBody.name})
  if(!ManageUser){
    throw new ApiError(httpStatus.NOT_FOUND, 'ManageUser not found');
  }
  return ManageUser;
}


const createShop = async (shopBody) => {
    const {Uid} = shopBody;
    
    let ManageUser = await manageUser.findById(Uid);
    let values = {}
    values = {...shopBody, ...{Uid:ManageUser.id}}
    if(ManageUser === null){
      throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
    }
    console.log(values)
    return Shop.create(values)
  };
  

const getShopById = async (id) => {
  return Shop.findById(id);
};

const getApartmentById = async (id) => {
    return Apartment.findById(id);
  };

const getAllApartment = async () => {
  return Apartment.aggregate([
    {
      $lookup:{
        from: 'manageusers',
        localField: 'Uid',
        foreignField: '_id',
        as: 'manageusersdata',
      }

    },
    {
      $unwind:'$manageusersdata'
    },
    {
      $lookup:{
        from: 'streets',
        localField: 'Strid',
        foreignField: '_id',
        as: 'streetsdata',
      }
    },
    {
      $unwind:'$streetsdata'
    },
    // {
    //   $lookup:{
    //     from: 'zones',
    //    let:{"zoneNames":"$_id"},
    //    pipeline:[
    //      {
    //        $match:{
    //          $expr:{
    //            $eq:["$$streetsdata.zone","$$zoneNames"]
    //          }
    //        }
    //      }
    //    ],
    //    as:"zoneName"

    //   }
    // },
    // {
    //   $unwind:'$zoneName'
    // },
      {
      $lookup:{
        from: 'zones',
        localField: 'manageusersdata.preferredZone',
        foreignField: '_id',
        as: 'zonesData',
      }
    },
    {
      $unwind:'$zonesData'
    },
    {
      $lookup:{
        from: 'wards',
        localField: 'manageusersdata.preferredWard',
        foreignField: '_id',
        as: 'wardsData',
      }
    },
    {
      $unwind:'$wardsData'
    },
    {
      $project: {
        userName:'$manageusersdata.name',
        streetName:'$streetsdata.street',
        // mobileNumber:"$manageusersdata.mobileNumber",
        id:1,
        Uid:1,
        photoCapture:1,
        AName:1,
        AType:1,
        NFlat:1,
        AFloor:1,
        Alat:1,
        Along:1,
        fileSource:1,
        zoneName:"$zonesData.zone",
        wardName:"$wardsData.ward",
        status:1,
        date:1,
        time:1,
        created:1,
        streetStatus:'$streetsdata.closed'

      },
    },
  ])
};


const getAllShop = async () => 
{
    return Shop.aggregate([
      {
        $lookup:{
          from: 'manageusers',
          localField: 'Uid',
          foreignField: '_id',
          as: 'manageusersdata',
        }
  
      },
      {
        $unwind:'$manageusersdata'
      },
      {
        $lookup:{
          from: 'streets',
          localField: 'Strid',
          foreignField: '_id',
          as: 'streetsdata',
        }
      },
      {
        $unwind:'$streetsdata'
      },
      {
        $lookup:{
          from: 'zones',
          localField: 'manageusersdata.preferredZone',
          foreignField: '_id',
          as: 'zonesData',
        }
      },
      {
        $unwind:'$zonesData'
      },
      {
        $lookup:{
          from: 'shoplists',
          localField: 'SType',
          foreignField: '_id',
          as: 'shoplistsdata',
        }
      },
      {
        $unwind:'$shoplistsdata'
      },
      {
        $lookup:{
          from: 'wards',
          localField: 'manageusersdata.preferredWard',
          foreignField: '_id',
          as: 'wardsData',
        }
      },
      {
        $unwind:'$wardsData'
      },
      {
        $project: {
          userName:'$manageusersdata.name',
          streetName:'$streetsdata.street',
          mobileNumber:"$manageusersdata.mobileNumber",
          id:1,
          Uid:1,
          photoCapture:1,
          SName:1,
          SType:'$shoplistsdata.shopList',
          Slat:1,
          Slong:1,
          baseImage:1,
          SOwner:1,
          SCont1:1,
          zoneName:"$zonesData.zone",
          wardName:"$wardsData.ward",
          status:1,
          date:1,
          time:1,
          created:1,
          streetStatus:'$streetsdata.closed'
  
        },
      },
    ]);
  };

  const getAllApartmentAndShop = async()=>{ 
    return await Street.aggregate([
      {
        $match: {
          $or:[{AllocationStatus:{$eq:"Allocated"}}, {AllocationStatus:{$eq:"DeAllocated"}}]
        }
        
      },
      {
        $lookup:{
          from: 'wards',
          localField: 'wardId',
          foreignField: '_id',
          as: 'wardData',
        }
      },
      {
        $unwind:'$wardData'
      },
      {
        $lookup:{
          from: 'zones',
          localField: 'zone',
          foreignField: '_id',
          as: 'zonesData',
        }
      },
      {
        $unwind:'$zonesData'
      },
      {
        $lookup:{
          from: 'manageusers',
          localField: 'AllocatedUser',
          foreignField: '_id',
          as: 'managedata',
        }
      },
      {
        $unwind:'$managedata'
      },
      {
        $lookup:{
          from: 'shops',
          let:{'street':'$_id'},
          
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$street", "$Strid"],  // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
                },
              },
            },
          ],
          as: 'shopData',
        }
      },
      {
        $lookup:{
          from: 'apartments',
          let:{'street':'$_id'},
          
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$$street", "$Strid"],  // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
                },
              },
            },
          ],
          as: 'apartmentData',
        }
      },
      {
        $project: {
          wardName:'$wardData.ward',
          id:1,
          zoneName:'$zonesData.zone',
          zoneId:'$zonesData.zoneCode',
          street:1,
          apartMent:'$apartmentData',
          closed:1,
          shop:'$shopData',
          userName:"$managedata.name"
        },
      },
  
    ]);


  }

const updateApartmentById = async (apartmentId, updateBody) => {
  let Apart = await getApartmentById(apartmentId);
  if (!Apart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Apartment not found');
  }
  Apart = await Apartment.findByIdAndUpdate({ _id: apartmentId }, updateBody, { new: true });
  return Apart;
};

const updateShopById = async (shopId, updateBody) => {
    let Sho = await getShopById(shopId);
    if (!Sho) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
    }
    Sho = await Shop.findByIdAndUpdate({ _id: shopId }, updateBody, { new: true });
    return Sho;
  };

const deleteapartmentById = async (apartmentId) => {
    const Apart = await getApartmentById(apartmentId);
    if (!Apart) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Apartment not found');
    }
    (Apart.archive = true), (Apart.active = false), await Apart.save();
    return Apart;
  };

  const deleteShopById = async (shopId) => {
    const Sho = await getApartmentById(shopId);
    if (!Sho) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Shop not found');
    }
    (Sho.archive = true), (Sho.active = false), await Sho.save();
    return Sho;
  };

module.exports = {
    createApartment,
    createShop,
    getShopById,
    getApartmentById,
    getAllApartment,
    getAllShop,
    apartmentAggregation,
  updateApartmentById,
  updateShopById,
  deleteapartmentById,
  deleteShopById,
  createManageUserAttendance,
  getAllManageUSerAttendance,
  getSearch,
  getAllApartmentAndShop,
  createManageUserAutoAttendance,
  getAllManageUserAutoAttendance,
  getAllManageUserAutoAttendanceTable
  // paginationManageUserAttendance,
 
};
