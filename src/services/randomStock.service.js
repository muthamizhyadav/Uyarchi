const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const randomStockModel = require('../models/randomStock.model');
const { Product } = require('../models/product.model');

const getProduct = async () => {
    let productName = await Product.aggregate([
        {
            $lookup: {
                from: 'productorderclones',
                localField: '_id',
                foreignField: 'productid',
                as: 'clonedProducts',
            }
        },
        {
            $project: {
                _id: 1,
                productTitle:1,

        }
    },
        
        
    ]);
    return productName;
}

const createrandomStock =  async (body) => {
    let stock = await randomStockModel.create(body);
    return stock;
  };


module.exports = {
    getProduct,
    createrandomStock,
}
