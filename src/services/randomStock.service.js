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

  
    const getAll = async (product,date) => {
        let productmatch;
        if (product != 'null') {
            productmatch = { product: { $eq: product } };
        } else {
            productmatch = { active: true };
        }
        let datematch;
        if (date != 'null') {
            datematch = { date: date };
        } else {
            datematch = { active: true };
        }
      };


      const getProductNameDetails = async (id) =>{
        let values = await randomStockModel.aggregate([
            {
                $match: {
                  $and: [{ _id: { $eq: id } }],
                },
              },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productName',
            }
        },
        {
            $unwind: "$productName"
        },
        {
            $project:{
                productName:"$productName.productTitle",
                NSFQ1:1,
                NSFQ2:1,
                NSFQ3:1,
                NSFW_Wastage:1,
                wastedImageFile:1, 
                _id:1, 

            }
        }
        ]);
        return values;
      }
  


module.exports = {
    getProduct,
    createrandomStock,
    getAll,
    getProductNameDetails,
}
