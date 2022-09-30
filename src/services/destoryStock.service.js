const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const walletModel = require('../models/b2b.walletAccount.model');
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

const createDestroyStock = async (sampleBody) => {
    return destroyStockModel.create(sampleBody);
  };


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
            worthRupees:1,
            productTitle:"$clonedProducts.productTitle",


        }
      }
  ]);
  return values;

  }








module.exports = {
    getProductNAmeFromRandom,
    createDestroyStock,
    getdetailsWithSorting,
}