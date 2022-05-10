const httpStatus = require('http-status');

const {Market} = require('../models/market.model');
const {MarketShops} = require('../models/market.model')

const ApiError = require('../utils/ApiError');

const  createmarket = async (marketbody)=>{
  return  Market.create(marketbody)
}
const createMarketShops = async (marketShopsBody) => {
  return MarketShops.create(marketShopsBody);
};

const getmarketById = async (id) => {
  const mark = Market.findById(id);
  if (!mark || mark.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, ' market Not Found');
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

const getAllmarket = async () =>{
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
  getMarketShopsById,
  createMarketShops
};