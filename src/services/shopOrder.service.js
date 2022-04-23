const httpStatus = require('http-status');
const { ShopOrder } = require('../models');
const ApiError = require('../utils/ApiError');

const createshopOrder = async(shopOrderBody) =>{
    return ShopOrder.create(shopOrderBody);
}

const getAllShopOrder = async()=>{
   return ShopOrder.find();
}


const getShopOrderById = async (shopOrderId) => {
    const shoporder = await ShopOrder.findById(shopOrderId);
    if (!shoporder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'shoporder  Not Found');
    }
    return shoporder;
  };

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
    updateShopOrderById,
    deleteShopOrderById,
};
