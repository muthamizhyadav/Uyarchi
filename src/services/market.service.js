const httpStatus = require('http-status');
const {Market} = require('../models/market.model');
const {MarketShops} = require('../models/market.model')
const manageUser = require('../models/manageUser.model')

const ApiError = require('../utils/ApiError');

const  createmarket = async (marketbody)=>{
  const {Uid} = marketbody;
    
  let ManageUser = await manageUser.findById(Uid);
  let values = {}
  values = {...marketbody, ...{Uid:ManageUser.id, userName:ManageUser.name, userNo:ManageUser.mobileNumber }}
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
  values = {...marketShopsBody, ...{Uid:ManageUser.id}}
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
  const mark = MarketShops.findById(id);
  if (!mark || mark.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, ' MarketShops Not Found');
  }
  return mark;
};


const getAllmarket = async () => {
    return Market.find();
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

const updatemarketShopsById = async (marketShopsId, updateBody) => {
  let mark = await getMarketShopsById(marketShopsId);
  if (!mark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'marketShops not found');
  }
  mark = await MarketShops.findByIdAndUpdate({ _id: marketShopsId }, updateBody, { new: true });
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

const deletemarketShopsById = async (marketId) => {
  const mark = await getMarketShopsById(marketId);
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
  getMarketShopsById
};