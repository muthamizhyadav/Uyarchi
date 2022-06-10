const httpStatus = require('http-status');
const B2BShop = require('../models/b2b.ShopClone.model');
const ApiError = require('../utils/ApiError');

const createB2bShopClone = async (shopBody) => {
  const shop = await B2BShop.create(shopBody);
  return shop;
};

const getAllB2BshopClone = async () => {
  return B2BShop.find();
};

const getB2BShopById = async (id) => {
  const shop = await B2BShop.findById(id);
  return shop;
};

const updateB2BShopById = async (id, updateBody) => {
  const shop = await getB2BShopById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Shop Not found');
  }
  shop = await B2BShop.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return shop;
};

const deleteB2BShopById = async (id) => {
  const shop = await getB2BShopById(id);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUNDm, 'Shop Not Found');
  }
  (shop.active = false), (shop.archive = true);
  await shop.save();
  return shop;
};

module.exports = {
  createB2bShopClone,
  getAllB2BshopClone,
  getB2BShopById,
  updateB2BShopById,
  deleteB2BShopById,
};
