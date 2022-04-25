const httpStatus = require('http-status');
const { SetSalesPrice } = require('../models');
const ApiError = require('../utils/ApiError');
const { Product } = require('../models/product.model')

const createSetSalesPrice = async(salepriceBody, updatebody) =>{
  console.log(salepriceBody.product)
  // salepriceBody.product.forEach(async (element) => {
  //  console.log(element.product)
  //  const productId = element.product;
  //  let onlinePrice = element.onlinePrice
  //  let salesmanPrice = element.salesmanPrice
  //  let oldstock = element.oldstock
  //  console.log(oldstock)
  //  await Product.findByIdAndUpdate({ _id: productId },{onlinePrice:onlinePrice, salesmanPrice:salesmanPrice, oldstock:oldstock}, { new: true });
  // });
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
