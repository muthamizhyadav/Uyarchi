const httpStatus = require('http-status');
const {Market} = require('../models/market.model');
const {MarketShops} = require('../models/market.model')
const manageUser = require('../models/manageUser.model')

const ApiError = require('../utils/ApiError');

const  createmarket = async (marketbody)=> {
  const {Uid} = marketbody;
    
  let ManageUser = await manageUser.findById(Uid);
  let values = {}
  values = {...marketbody, ...{Uid:ManageUser.id, userName:ManageUser.name, userNo:ManageUser.mobileNumber,
  status:null}}
  if(ManageUser === null){
    throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
  }
  console.log(values)
  return Market.create(values)
}

const createMarketShops = async (marketShopsBody) => {
  const {Uid} = marketShopsBody;
    
  let ManageUser = await manageUser.findById(Uid);
  let values = {}
  values = {...marketShopsBody, ...{Uid:ManageUser.id, status:null}}
  if(ManageUser === null){
    throw new ApiError(httpStatus.NO_CONTENT, "!oops 🖕")
  }
  console.log(values)
  return MarketShops.create(values)
};

const getmarketById = async (id) => {
  const mark = Market.findById(id);
  if (!mark || mark.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, ' market Not Found');
  }
  return mark;
};

const getMarketShops = async (id) => {
  console.log(id)
  const mark = await MarketShops.find({MName:id});
    console.log(mark)
  if (!mark || mark.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, ' MarketShops Not Found');
  }
  return mark;
};

const getMarketShopsById = async (id) => {
  const mark = MarketShops.aggregate([
    {
       $match:{
         $and:[{_id:{$eq:id}},{active:{$eq:true}}]
       },
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
    $project:{
      
        ShopType:'$shoplistsdata.shopList',
        MName:1,
        SName:1,
        SNo:1,
        mobile:1,
        ownname:1,
        ownnum:1,
        mlatitude:1,
        mlongitude:1,
        image:1
     },
  },

  ])

  // if (!mark || mark.active === false) {
  //   throw new ApiError(httpStatus.NOT_FOUND, ' MarketShops Not Found');
  // }
  return mark;
};


const getAllmarket = async () => {
    return Market.find();
} 

const getAllmarketTable = async (id,page) => {
  let match;
  if(id !='null'){
    match=[{ _id: { $eq: id }},{active:{$eq:true}}]
  }else{
    match=[{ _id: { $ne: null }},{active:{$eq:true}}]
  }
  const mark = await Market.aggregate([
      {
        $match: {
          $and: match
        },
      },
      {
        $skip:10*parseInt(page)
      },
     {
        $limit:10
      },
    ])
    const count=await Market.aggregate([
      {
        $match: {
          $and: match,
        },
      },
    ]);
  console.log(mark)
    return {
      data:mark,
      count:count.length
    }
  }   

const getAllmarketShops = async () =>{
  return MarketShops.find();
} 
// const querCombo = async (filter, options) => {
//   return ProductCombo.paginate(filter, options);
// };

const updatemarketById = async (marketId, updateBody) => {
  let mark = await getmarketById(marketId);
  if (!mark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'market not found');
  }
  mark = await Market.findByIdAndUpdate({ _id: marketId }, updateBody, { new: true });
  return mark;
};

const updatemarketShopsById = async (marketShopId, updateBody) => {
  let mark = await getMarketShopsById(marketShopId);
  if (!mark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'marketShops not found');
  }
  mark = await MarketShops.findByIdAndUpdate({ _id: marketShopId }, updateBody, { new: true });
  return mark;
};


const deletemarketById = async (marketId) => {
  const mark = await getmarketById(marketId);
  if (!mark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'market not found');
  }
  (mark.active = false), (mark.archive = true), await mark.save();
  return mark;
};

const deletemarketShopsById = async (marketShopId) => {
  const mark = await getMarketShopsById(marketShopId);
  if (!mark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'marketShops not found');
  }
  (mark.active = false), (mark.archive = true), await mark.save();
  return mark;
};

module.exports = {
  createmarket,
  getmarketById,
  updatemarketById,
  deletemarketById,
  getAllmarket,
  deletemarketShopsById,
  updatemarketShopsById,
  getAllmarketShops,
  createMarketShops,
  getMarketShops,
  getMarketShopsById,
  getAllmarketTable
};