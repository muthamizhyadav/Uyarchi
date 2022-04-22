const httpStatus = require('http-status');
const { SetSalesPrice } = require('../models');
const ApiError = require('../utils/ApiError');

const createSetSalesPrice = async(salepriceBody) =>{
    return SetSalesPrice.create(salepriceBody);
}

const getAllSetSalesPrice = async()=>{
   return SetSalesPrice.find();
}


const getSetSalesPriceById = async (salesPriceId) => {
    const salePrice = await SetSalesPrice.findById(salesPriceId);
    if (!salePrice) {
      throw new ApiError(httpStatus.NOT_FOUND, 'salePrice  Not Found');
    }
    return salePrice;
  };

const updateSetSalesPriceById = async (salesPriceId, updateBody) => {
  let saleprice = await getSetSalesPriceById(salesPriceId);
  if (!saleprice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'saleprice not found');
  }
  saleprice = await SetSalesPrice.findByIdAndUpdate({ _id: salesPriceId }, updateBody, { new: true });
  return saleprice;
};

const deleteSetSalesPriceById = async (salesPriceId) => {
  const setSales = await getSetSalesPriceById(salesPriceId);
  if (!setSales) {
    throw new ApiError(httpStatus.NOT_FOUND, 'setSales not found');
  }
  (setSales.active = false), (setSales.archive = true), await setSales.save();
  return setSales;
};

module.exports = {
    createSetSalesPrice,
    getAllSetSalesPrice,
    getSetSalesPriceById,
    updateSetSalesPriceById,
    deleteSetSalesPriceById,
};
