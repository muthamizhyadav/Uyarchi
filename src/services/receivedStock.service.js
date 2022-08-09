const httpStatus = require('http-status');
const { ReceivedOrders } = require('../models');
const ApiError = require('../utils/ApiError');
const ReceivedProduct = require('../models/receivedProduct.model');
const ReceivedStock = require('../models/receivedStock.model');
const { Product } = require('../models/product.model');
const { usableStock, Stockhistory } = require('../models/usableStock.model');

const getDataById = async (id) => {
  let values = await ReceivedStock.aggregate([
    {
      $match: {
        $and: [{ groupId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productsData',
      },
    },
    {
      $unwind: '$productsData',
    },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        status: 1,
        productName: '$productsData.productTitle',
        incomingWastage: 1,
        incomingQuantity: 1,
      },
    },
  ]);
  return values;
};

const getDataByLoading = async (id) => {
  let values = await ReceivedStock.aggregate([
    {
      $match: {
        $and: [{ groupId: { $eq: id } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productsData',
      },
    },
    {
      $unwind: '$productsData',
    },
    {
      $lookup: {
        from: 'callstatuses',
        localField: 'callstatusId',
        foreignField: '_id',
        as: 'callstatusData',
      },
    },
    {
      $unwind: '$callstatusData',
    },
    {
      $project: {
        _id: 1,
        date: 1,
        time: 1,
        status: 1,
        productName: '$productsData.productTitle',
        incomingWastage: 1,
        incomingQuantity: 1,
        confirmOrder: '$callstatusData.confirmOrder',
        confirmprice: '$callstatusData.confirmprice',
      },
    },
  ]);
  return values;
};

const updateReceivedStockById = async (id, updateBody) => {
  let receivedStock = await ReceivedStock.findById(id);
  if (!receivedStock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  receivedStock = await ReceivedStock.findByIdAndUpdate({ _id: id }, updateBody, { new: true });

  return receivedStock;
};
const updatesegrecation = async (id, updateBody) => {
  console.log(':sdxdcfvxsdcfxsdf', id);
  let receivedStock = await ReceivedStock.findById(id);
  if (!receivedStock) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  receivedStock = await ReceivedStock.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  const date = receivedStock.date;
  let usable = await usableStock.findOne({ productId: receivedStock.productId, data: date });
  if (!usable) {
    usable = await usableStock.create({
      productId: receivedStock.productId,
      date: receivedStock.date,
      time: receivedStock.time,
    });
  }
  let FQ1 = updateBody.FQ1 != null ? updateBody.FQ1 : 0;
  let FQ2 = updateBody.FQ2 != null ? updateBody.FQ2 : 0;
  let FQ3 = updateBody.FQ3 != null ? updateBody.FQ3 : 0;
  let wastage = updateBody.seg_wastage != null ? updateBody.seg_wastage : 0;
  let useFQ1 = usable.FQ1 != null ? usable.FQ1 + FQ1 : FQ1;
  let useFQ2 = usable.FQ2 != null ? usable.FQ2 + FQ2 : FQ2;
  let useFQ3 = usable.FQ3 != null ? usable.FQ3 + FQ3 : FQ3;
  let totalStock = usable.totalStock != null ? usable.totalStock : 0;
  let usetotal = FQ1 + FQ2 + FQ3 + totalStock;
  let usewastage = usable.seg_wastage != null ? usable.seg_wastage + wastage : wastage;
  await Stockhistory.create({
    usableStock: usable._id,
    FQ1: FQ1,
    FQ2: FQ2,
    FQ3: FQ3,
    wastage: wastage,
  });
  await usableStock.findByIdAndUpdate(
    { _id: usable._id },
    { FQ1: useFQ1, FQ2: useFQ2, FQ3: useFQ3, wastage: usewastage, totalStock: usetotal },
    { new: true }
  );
  return usable;
};

const getDetailsByProductId = async (productId, date, page) => {
  console.log('zsdad');
  const values = await ReceivedStock.aggregate([
    {
      $match: {
        $and: [{ productId: { $eq: productId } }, { date: { $eq: date } }, { status: { $in: ['Loaded', 'Billed'] } }],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplierData',
      },
    },
    {
      $unwind: '$supplierData',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'productData',
      },
    },
    {
      $unwind: '$productData',
    },
    {
      $project: {
        incomingQuantity: 1,
        incomingWastage: 1,
        supplierId: 1,
        FQ1: 1,
        FQ2: 1,
        FQ3: 1,
        segStatus: 1,
        seg_wastage: 1,
        supplierName: '$supplierData.primaryContactName',
        supplierNumber: '$supplierData.primaryContactNumber',
        productName: '$productData.productTitle',
      },
    },
  ]);
  let product = await Product.findById(productId);
  return { values: values, product: product.productTitle, date: date };
};

module.exports = { getDataById, updateReceivedStockById, getDataByLoading, getDetailsByProductId, updatesegrecation };
