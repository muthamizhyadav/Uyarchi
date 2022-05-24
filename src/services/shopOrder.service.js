const httpStatus = require('http-status');
const { ShopOrder, ProductorderSchema } = require('../models/shopOrder.model');
const { Product } = require('../models/product.model');
const ApiError = require('../utils/ApiError');

const createshopOrder = async (shopOrderBody) => {
  let createShopOrder = await ShopOrder.create(shopOrderBody);
    console.log(createShopOrder)
   let { product ,date,time,shopId} = shopOrderBody
      product.forEach(async(e)=>{
        ProductorderSchema.create({
          orderId:createShopOrder.id,
          productid:e.productid,  
          quantity:e.quantity,
          priceperkg:e.priceperkg,
          date:date,
          time:time,
          customerId:shopId
        });
      })
  // const prod = await Product.findById(productName)
  // console.log(prod.productTitle)
  // let pro = productName=prod.productTitle
  // product.push({productName:pro})
  // console.log(product)
  return createShopOrder;
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
      $project: {
        districtName: {"$eq": ["$_id", "$products.productid"]},
        product:1
      },
    }

  ])
 
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
