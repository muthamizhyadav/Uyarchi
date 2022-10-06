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




  const getdetailsWithSorting = async (product, date)=>{
    let match;
    if(product != 'null' && date != 'null'){
        match = [{ product: { $eq: product }}, { date: { $eq: date }}, { active: { $eq: true }}];
    }else if (product != 'null') {
    match = [{ product: { $eq: product } }, { active: { $eq: true } }];
   
  } else if (date != 'null') {
    match = [{ date: { $eq: date } }, { active: { $eq: true } }];
  } else {
    match = [{ product: { $ne: null } }, { active: { $eq: true } }];
  }

  let values = await randomStockModel.aggregate([
    {
        $match: {
            $and:match,
        },
    },
    {
        $lookup: {
          from: 'products',
          localField: 'product',
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
            product:1,
            NSFW_Wastage:1,

            quantityToDestroy:1,
            worthRupees:1,
            productTitle:"$clonedProducts.productTitle",
            balanceQuantity: { 
              $subtract: [ "$NSFW_Wastage", "$quantityToDestroy" ] 
            } 
            } 
        }
      
  ]);
  return values;

  }

  const updateProduct = async(id,updatebody  )=>{
    let currentDate = moment().format('YYYY-MM-DD');
    let currenttime =  moment().format('HHmm');
    let updateProduct = await randomStockModel.findById(id);
    if (!updateProduct) {
      throw new ApiError(httpStatus.NOT_FOUND, ' Not Found');
    }

    updateProduct = await randomStockModel.findByIdAndUpdate({ _id: id }, updatebody, { new: true });

    await destroyStockModel.create({
     
      date: currentDate,
      time: currenttime,
      created: moment(),
      product: updateProduct._id,
      quantityToDestroy: updatebody.quantityToDestroy,
      status: updatebody.status,
    });


    return updateProduct;
  };


  const getHistory = async (id)=>{
    let values = await destroyStockModel.aggregate([
      {
        $match: {
          $and: [{ product: { $eq: id } }],
        },
      },
    ]);
    let total = await destroyStockModel.aggregate([
      {
        $match: {
          $and: [{ product: { $eq: id } }],
        },
      },
     
      { $group: { _id : null, sum : { $sum: "$quantityToDestroy" } }}
    ]);
    return {values: values, total: total };
  };








module.exports = {
    getProductNAmeFromRandom,
    // createDestroyStock,
    getdetailsWithSorting,
    updateProduct,
    getHistory,
}