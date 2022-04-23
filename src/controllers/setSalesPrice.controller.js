const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { setSalesPrice } = require('../services');
const { Product } = require('../models/product.model');


const createSetSalesPrice = catchAsync(async(req, res)=> {
  
    const salesprice = await setSalesPrice.createSetSalesPrice(req.body);
    if (!salesprice) {
      throw new ApiError(httpStatus.NOT_FOUND, 'salesprice Not Fount.');
    }
    res.status(httpStatus.CREATED).send(salesprice);
  });
  
  const getAllSetSalesPrice = catchAsync(async (req, res)=>{
      const salesprice = await setSalesPrice.getAllSetSalesPrice()
      res.send(salesprice);
  })
  
 const getSetSalesPriceById = catchAsync (async (req, res)=>{
     const salesprice = await setSalesPrice.getSetSalesPriceById(req.params.salesPriceId);
     if(!salesprice){
         throw new ApiError(httpStatus.NOT_FOUND, "salesprice Not Found");
     }
     res.send(salesprice)
 })
  
  const updateSetSalesPriceById = catchAsync(async (req, res) => {
    const salesprice = await setSalesPrice.updateSetSalesPriceById (req.params.salesPriceId, req.body);
    res.send(salesprice);
  });
  
  const deleterolesById = catchAsync(async (req, res) => {
    await setSalesPrice.deleteSetSalesPriceById (req.params.salesPriceId);
    res.status(httpStatus.NO_CONTENT).send();
  });
  
  module.exports = {
      createSetSalesPrice,
      getAllSetSalesPrice,
      getSetSalesPriceById,
      updateSetSalesPriceById,
      deleterolesById,
  };