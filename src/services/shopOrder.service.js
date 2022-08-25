const httpStatus = require('http-status');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');
const { Product } = require('../models/product.model');
const { Shop } = require('../models/b2b.ShopClone.model');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');

const createshopOrder = async (shopOrderBody, userid) => {
  let body = { ...shopOrderBody, ...{ Uid: userid } };
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
  const Buy = await ShopOrderClone.find();
  let center = '';
  // console.log(Buy.length);
  if (Buy.length < 9) {
    center = '0000';
  }
  if (Buy.length < 99 && Buy.length >= 9) {
    center = '000';
  }
  if (Buy.length < 999 && Buy.length >= 99) {
    center = '00';
  }
  if (Buy.length < 9999 && Buy.length >= 999) {
    center = '0';
  }
  // console.log(center, 0);
  let currentDate = moment().format('YYYY-MM-DD');
  let currenttime = moment().format('HHmmss');
  let userId = '';
  let totalcount = Buy.length + 1;

  userId = 'OD' + center + totalcount;
  let bod = { ...body, ...{ Uid: userid, OrderId: userId, date: currentDate, time: currenttime, created: moment() } };
  console.log(bod);

  let createShopOrderClone = await ShopOrderClone.create(bod);
  let { product, time, shopId } = body;
  await Shop.findByIdAndUpdate({ _id: shopId }, { callingStatus: 'accept', callingStatusSort: 6 }, { new: true });
  product.forEach(async (e) => {
    ProductorderClone.create({
      orderId: createShopOrderClone.id,
      productid: e._id,
      quantity: e.quantity,
      priceperkg: e.priceperkg,
      GST_Number: e.GST_Number,
      HSN_Code: e.HSN_Code,
      packtypeId: e.packtypeId,
      packKg: e.packKg,
      unit: e.unit,
      date: currentDate,
      time: currenttime,
      customerId: shopId,
      created: moment(),
    });
  });
  return createShopOrderClone;
};

// GST_Number: {
//   type: Number,
// },
// HSN_Code: {
//   type: String,
// },
// packtypeId: {
//   type: String,
// },
// unit: {
//   type: String,
// },
// packKg: {
//   type: String,
// },

const getAllShopOrderClone = async (date, page) => {
  let values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }],
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        as: 'productOrderdata',
      },
    },
    {
      $unwind: '$productOrderdata',
    },

    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await ShopOrderClone.find().count();
  return { values: values, total: total };
};

const getShopOrderCloneById = async (id) => {
  let Values = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ _id: { $eq: id } }],
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
    {
      $lookup: {
        from: 'marketshopsclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'marketshopData',
      },
    },
  ]);
  return Values;
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

const getShopNameCloneWithPagination = async (page, userId) => {
  console.log();
  let value = await ShopOrderClone.aggregate([
    {
      $sort: { date: -1, time: -1 },
    },
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
    {
      $unwind: '$shopData',
    },
    {
      $project: {
        _id: 1,
        created: 1,
        delivery_type: 1,
        time_of_delivery: 1,
        total: 1,
        gsttotal: 1,
        subtotal: 1,
        SGST: 1,
        CGST: 1,
        productTotal: {  $size:'$product' },
        paidamount: 1,
        shopName: '$shopData.SName',
        contact: '$shopData.mobile',
        status: 1,
      },
    },
    //b2busers
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await ShopOrderClone.find({ Uid: { $eq: userId } }).count();
  return {
    value: value,
    total: total,
  };
};

const getAllShopOrder = async (UserRole) => {
  let value;
  if (UserRole == '') console.log(UserRole);
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

// TELECALLER

const getAll = async () => {
  return ShopOrderClone.find();
};
21;

const createOrderId = async (body) => {
  return ShopOrderClone.create(body);
};

module.exports = {
  // product
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
  getShopNameCloneWithPagination,
  createshopOrder,
  getAllShopOrder,
  getShopOrderById,
  getProductDetailsByProductId,
  updateShopOrderById,
  getShopNameWithPagination,
  deleteShopOrderById,

  // Telecaller

  getAll,
  createOrderId,
};
