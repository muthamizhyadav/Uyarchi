const httpStatus = require('http-status');
const { market } = require('../models');
const ApiError = require('../utils/ApiError');

const createmarket= async (marketBody) => {
  return market.create(marketBody);
};

const getmarketById = async (id) => {
  const mark = market.findById(id);
  if (!mark || mark.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, ' market Not Found');
  }
  return mark;
};

const getAllmarket = async () =>{
    return market.find();
} 
// const querCombo = async (filter, options) => {
//   return ProductCombo.paginate(filter, options);
// };

const updatemarketById = async (marketId, updateBody) => {
  let mark = await getmarketById(marketId);
  if (!mark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'market not found');
  }
  mark = await market.findByIdAndUpdate({ _id: marketId }, updateBody, { new: true });
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

module.exports = {
  createmarket,
  getmarketById,
  updatemarketById,
  deletemarketById,
  getAllmarket
};