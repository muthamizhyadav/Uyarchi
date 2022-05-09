const httpStatus = require('http-status');
const { ShopOrder } = require('../models');
const { Product } = require('../models/product.model');
const ApiError = require('../utils/ApiError');

const createshopOrder = async (shopOrderBody) => {
  // let { product } = shopOrderBody
  // let productName = product.map((e)=>{
  //   return e.productid
  // })
  // const prod = await Product.findById(productName)
  // console.log(prod.productTitle)
  // let pro = productName=prod.productTitle
  // product.push({productName:pro})
  // console.log(product)
  return ShopOrder.create(shopOrderBody);
};

const getAllShopOrder = async () => {
  return ShopOrder.find();
};

const getShopOrderById = async (shopOrderId) => {
  const shoporder = await ShopOrder.findById(shopOrderId);
  if (!shoporder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shoporder  Not Found');
  }
  return shoporder;
};

const getProductDetailsByProductId = async (id)=>{

 return await ShopOrder.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'product.productid',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $unwind: "$products"
    },
    {
      // find a company member, that matches
      // to a given person
      $addFields: {
        matchedMember: {
          $arrayElemAt: [{
            $filter: {
              input: '$products.product',
              cond: {
                $eq: ['$$this._id', 'products.productid'],
              }
            },
          }, 1]
        }
      }
    },
    
    {
      $project: {
        districtName: '$products',
        product:1
      },
    }

  ])
  // const product = await Product.find({},{'id':1})
  // let str = []

  
  // product.forEach(async(e)=>{
  //   const productid=e._id;
  // //   console.log(productid)
  //  const shoporder = await ShopOrder.find({product:{$elemMatch:{productid:productid}, $project:{
  //    _id:1
  //  }}})
  //  console.log(shoporder)
  // //  str.push(shoporder)
  // })
 
}

const updateShopOrderById = async (shopOrderId, updateBody) => {
  let shoporder = await getShopOrderById(shopOrderId);
  if (!shoporder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shoporder not found');
  }
  shoporder = await ShopOrder.findByIdAndUpdate({ _id: shopOrderId }, updateBody, { new: true });
  return shoporder;
};

const deleteShopOrderById = async (shopOrderId) => {
  const shoporder = await getSetSalesPriceById(shopOrderId);
  if (!shoporder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'shoporder not found');
  }
  (shoporder.active = false), (shoporder.archive = true), await shoporder.save();
  return shoporder;
};

module.exports = {
  createshopOrder,
  getAllShopOrder,
  getShopOrderById,
  getProductDetailsByProductId,
  updateShopOrderById,
  deleteShopOrderById,
};
