const httpStatus = require('http-status');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');
const { Product } = require('../models/product.model');
const ApiError = require('../utils/ApiError');

const createshopOrder = async (shopOrderBody, userid) => {
  let body = { ...shopOrderBody, ...{ Uid: userid } };
  console.log(body);
  let createShopOrder = await ShopOrder.create(body);
  console.log(createShopOrder);
  let { product, date, time, shopId } = shopOrderBody;
  product.forEach(async (e) => {
    ProductorderSchema.create({
      orderId: createShopOrder.id,
      productid: e.productid,
      quantity: e.quantity,
      priceperkg: e.priceperkg,
      date: date,
      time: time,
      customerId: shopId,
    });
  });
  return createShopOrder;
};

const createshopOrderClone = async (body, userid) => {
  let bod = { ...body, ...{ Uid: userid } };
  console.log(body);
  let createShopOrderClone = await ShopOrderClone.create(bod);
  console.log(createShopOrderClone);
  let { product, date, time, shopId } = body;
  product.forEach(async (e) => {
    ProductorderClone.create({
      orderId: createShopOrderClone.id,
      productid: e.productid,
      quantity: e.quantity,
      priceperkg: e.priceperkg,
      date: date,
      time: time,
      customerId: shopId,
    });
  });
  return createShopOrderClone;
};

const getAllShopOrderClone = async () => {
  return await ShopOrderClone.find();
};

const getShopOrderCloneById = async (id) => {
  const shoporderClone = await ShopOrderClone.findById(id);
  if (!shoporderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopOrderClone Not Found');
  }

  return shoporderClone;
};

const updateShopOrderCloneById = async (id, updatebody) => {
  let shoporderClone = await ShopOrderClone.findById(id);
  if (!shoporderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopOrderClone Not Found');
  }
  shoporderClone = await ShopOrderClone.findByIdAndUpdate({ _id: id }, updatebody, { new: true });
  return shoporderClone;
};

const deleteShopOrderCloneById = async (id) => {
  let shoporderClone = await ShopOrderClone.findById(id);
  if (!shoporderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ShopOrderClone Not Found');
  }
  (shoporderClone.active = false), (shoporderClone.archive = true);
  await shoporderClone.save();
};

const createProductOrderClone = async (body) => {
  const productorderClone = await ProductorderClone.create(body);
  return productorderClone;
};

const getAllProductOrderClone = async () => {
  return await ProductorderClone.find();
};

const getProductOrderCloneById = async (id) => {
  const productorderClone = await ProductorderClone.findById(id);
  if (!productorderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrderClone not found');
  }
  return productorderClone;
};

const updateProductOrderCloneById = async (id, updateBody) => {
  let productorderClone = await ProductorderClone.findById(id);
  if (!productorderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrderClone not found');
  }
  productorderClone = await ProductorderClone.findByIdAndUpdate({ _id: id }, updateBody, { new: true });

  return productorderClone;
};

const deleteProductOrderClone = async (id) => {
  let productorderClone = await ProductorderClone.findById(id);
  if (!productorderClone) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProductOrderClone not found');
  }
  (productorderClone.active = false), (productorderClone.archive = true);
  await productorderClone.save();
};

const getShopNameWithPagination = async (page, userId) => {
  console.log(userId);
  return ShopOrder.aggregate([
    {
      $match: {
        $and: [{ Uid: { $eq: userId } }],
      },
    },
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopData',
      },
    },
    //b2busers
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
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

const getProductDetailsByProductId = async (id) => {
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
      $unwind: '$products',
    },

    {
      $project: {
        districtName: { $eq: ['$_id', '$products.productid'] },
        product: 1,
      },
    },
  ]);
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
  createProductOrderClone,
  getAllProductOrderClone,
  getProductOrderCloneById,
  updateProductOrderCloneById,
  deleteProductOrderClone,
  // shopOrderClone

  createshopOrderClone,
  getAllShopOrderClone,
  updateShopOrderCloneById,
  getShopOrderCloneById,
  deleteShopOrderCloneById,

  createshopOrder,
  getAllShopOrder,
  getShopOrderById,
  getProductDetailsByProductId,
  updateShopOrderById,
  getShopNameWithPagination,
  deleteShopOrderById,
};
