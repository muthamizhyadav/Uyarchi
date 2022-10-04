const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const randomStockModel = require('../models/randomStock.model');
const destroyStockModel = require('../models/destoryStock.model')

const getProductNAmeFromRandom = async()=>{
    
        let values = await randomStockModel.aggregate([
            {
              $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productName',
              },
            },
            {
              $unwind: '$productName',
            },
            { $group : { _id : "$product" ,Names : { $addToSet : "$productName.productTitle" } }}
          
          ]);
          
          return  values;   
}

// const createDestroyStock = async (sampleBody) => {
//   let time = moment().format('HHmm');
//   let date = moment().format('yyyy-MM-DD');
//   let created = moment();
//   let datas = {
//     time : time,
//     date : date,
//     created : created,
//   };
//   let bodyData = { ...datas, ...sampleBody};
//   return destroyStockModel.create(bodyData);
    
//   };


  const getdetailsWithSorting = async (productId, date)=>{
    let match;
    if(productId != 'null' && date != 'null'){
        match = [{ productId: { $eq: productId }}, { date: { $eq: date }}, { active: { $eq: true }}];
    }else if (productId != 'null') {
    match = [{ productId: { $eq: productId } }, { active: { $eq: true } }];
   
  } else if (date != 'null') {
    match = [{ date: { $eq: date } }, { active: { $eq: true } }];
  } else {
    match = [{ productId: { $ne: null } }, { active: { $eq: true } }];
  }

  let values = await destroyStockModel.aggregate([
    {
        $match: {
            $and:match,
        },
    },
    {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'clonedProducts',
        },
      },
      {
        $unwind: '$clonedProducts',
      },
      {
        $project:{
            date:1,
            time:1,
            productId:1,
            wastage:1,

            // quantityToDestroy:1,
            worthRupees:1,
            productTitle:"$clonedProducts.productTitle",
            // balanceQuantity: { 
            //   $subtract: [ "$wastage", "$quantityToDestroy" ] 
            // } 
            } 
        }
      
  ]);
  return values;

  }

  const updateProduct = async(id,updatebody  )=>{
    let product = await randomStockModel.findById(id);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, ' Not Found');
    }
    product = await randomStockModel.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
    return product;
  };








module.exports = {
    getProductNAmeFromRandom,
    // createDestroyStock,
    getdetailsWithSorting,
    updateProduct,
}