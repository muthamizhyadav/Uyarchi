const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const walletModel = require('../models/b2b.walletAccount.model');
const randomStockModel = require('../models/randomStock.model');

const getProductNAmeFromRandom = async()=>{
    let values = await randomStockModel.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productName'
            }
        },
        {
            $unwind: "$productName"
        },
        {
            $project:{
                _id:1,
                product:1,
                productName:"$productName.productTitle"

            }
        }
    ]);
    return values;
}





module.exports = {
    getProductNAmeFromRandom,
}