const httpStatus = require('http-status');
const { CallStatus } = require('../models');
const Supplier = require('../models/supplier.model');
const ApiError = require('../utils/ApiError');
const { Product } = require('../models/product.model');
const moment = require('moment');

const createCallStatus = async (callStatusBody) => {
  const serverdate = moment().format('YYYY-MM-DD');
  const servertime = moment().format('HHmmss');
  let values = { ...callStatusBody, ...{ date: serverdate, time: servertime, created: moment() } };
  return CallStatus.create(values);
};

const getCallStatusById = async (id) => {
  return CallStatus.findById(id);
};

const getProductAndSupplierDetails = async (page) => {
  let details = await Supplier.aggregate([
    {
      $lookup: {
        from: 'callstatuses',
        localField: '_id',
        foreignField: 'supplierid',
        pipeline: [
          { $match: { confirmcallstatus: 'Accepted', StockReceived: 'Pending', showWhs: true } },
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        as: 'CallstatusData',
      },
    },
    {
      $unwind: '$CallstatusData',
    },
    {
      $project: {
        primaryContactName: 1,
        primaryContactNumber: 1,
        secondaryContactName: 1,
        secondaryContactNumber: 1,
        RegisteredAddress: 1,
        countries: 1,
        district: 1,
        gstNo: 1,
        email: 1,
        pinCode: 1,
        ConfirmOrders: '$CallstatusData.myCount',
      },
    },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
  ]);
  let total = await Supplier.aggregate([
    {
      $lookup: {
        from: 'callstatuses',
        localField: '_id',
        foreignField: 'supplierid',
        pipeline: [
          { $match: { confirmcallstatus: 'Accepted', StockReceived: 'Pending' } },
          { $group: { _id: null, myCount: { $sum: 1 } } },
        ],
        as: 'CallstatusData',
      },
    },
    {
      $unwind: '$CallstatusData',
    },
  ]);
  return {
    value: details,
    total: total.length,
  };
};

const getDataWithSupplierId = async (id, page) => {
  let values = await CallStatus.aggregate([
    {
      $match: {
        $and: [
          { supplierid: { $eq: id } },
          { StockReceived: { $eq: 'Pending' } },
          { confirmcallstatus: { $eq: 'Accepted' } },
        ],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'ProductData',
      },
    },
    {
      $unwind: '$ProductData',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'supplierData',
      },
    },
    {
      $unwind: '$supplierData',
    },
    {
      $project: {
        _id: 1,
        active: 1,
        StockReceived: 1,
        qtyOffered: 1,
        strechedUpto: 1,
        price: 1,
        status: 1,
        requestAdvancePayment: 1,
        callstatus: 1,
        callDetail: 1,
        productid: 1,
        supplierid: 1,
        date: 1,
        time: 1,
        phApproved: 1,
        phStatus: 1,
        phreason: 1,
        confirmOrder: 1,
        orderType: 1,
        confirmcallDetail: 1,
        confirmcallstatus: 1,
        confirmprice: 1,
        exp_date: 1,
        supplierContact: '$supplierData.primaryContactNumber',
        supplierName: '$supplierData.primaryContactName',
        productTitle: '$ProductData.productTitle',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await CallStatus.aggregate([
    {
      $match: {
        $and: [
          { supplierid: { $eq: id } },
          { StockReceived: { $eq: 'Pending' } },
          { confirmcallstatus: { $eq: 'Accepted' } },
        ],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'ProductData',
      },
    },
    {
      $unwind: '$ProductData',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'supplierData',
      },
    },
    {
      $unwind: '$supplierData',
    },
  ]);
  let totalss = await CallStatus.aggregate([
    {
      $match: {
        $and: [
          { supplierid: { $eq: id } },
          { StockReceived: { $eq: 'Pending' } },
          { confirmcallstatus: { $eq: 'Accepted' } },
        ],
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$created' } },
        count: { $sum: 1 },
      },
    },
  ]);
  let getSupplier = await Supplier.findById(id);
  return { values: values, total: total.length, supplier: getSupplier, totalss: totalss };
};

const updateCallStatusById = async (id, updateBody) => {
  let callstatus = await CallStatus.findById(id);
  if (!callstatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CallStatus Not Found');
  }
  callstatus = await CallStatus.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return callstatus;
};

const deleteCallStatusById = async (id) => {
  const callstatus = await getCallStatusById(id);
  if (!callstatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Business_Details not found');
  }
  (callstatus.archive = true), (callstatus.active = false), await callstatus.save();
  return callstatus;
};

const finishOrder = async (pId, date) => {
  let values = await CallStatus.find({ productid: pId, date: date, confirmcallstatus: 'Accepted' });
  values.forEach(async (e) => {
    await CallStatus.findByIdAndUpdate({ _id: e._id }, { showWhs: true }, { new: true });
  });
  return 'Order Finished 😃';
};

const getCallstatusForSuddenOrders = async (page) => {
  let values = await CallStatus.aggregate([
    {
      $match: {
        $and: [{ orderType: { $eq: 'sudden' } }, { confirmcallstatus: { $eq: 'Accepted' } }],
      },
    },
    {
      $sort: { date: -1, time: -1 },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'SupplierData',
      },
    },
    {
      $unwind: '$SupplierData',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productData',
      },
    },
    {
      $unwind: '$productData',
    },
    {
      $project: {
        productName: '$productData.productTitle',
        supplierName: '$SupplierData.primaryContactName',
        supplierContact: '$SupplierData.primaryContactNumber',
        date: 1,
        time: 1,
        confirmOrder: 1,
        confirmcallstatus: 1,
        confirmprice: 1,
        status: 1,
        exp_date: 1,
        productid: 1,
        order_Type: 1,
        supplierid: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await CallStatus.aggregate([
    {
      $match: {
        $and: [{ orderType: { $eq: 'sudden' } }, { confirmcallstatus: { $eq: 'Accepted' } }],
      },
    },
    {
      $sort: { date: -1, time: -1 },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'SupplierData',
      },
    },
    {
      $unwind: '$SupplierData',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productData',
      },
    },
    {
      $unwind: '$productData',
    },
  ]);
  return { values: values, total: total.length };
};

const suddenOrdersDisplay = async (productId) => {
  let currentDate = moment().format('DD-MM-YYYY');
  let values = await CallStatus.aggregate([
    {
      $match: {
        $and: [
          { date: { $eq: currentDate } },
          { productid: { $eq: productId } },
          { confirmcallstatus: { $eq: 'Accepted' } },
        ],
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'supplierdata',
      },
    },
    {
      $unwind: '$supplierdata',
    },
    {
      $project: {
        StockReceived: 1,
        _id: 1,
        orderType: 1,
        confirmOrder: 1,
        confirmcallstatus: 1,
        confirmprice: 1,
        exp_date: 1,
        date: 1,
        time: 1,
        supplierName: '$supplierdata.primaryContactName',
      },
    },
  ]);
  return values;
};

module.exports = {
  createCallStatus,
  getCallStatusById,
  updateCallStatusById,
  deleteCallStatusById,
  getProductAndSupplierDetails,
  getDataWithSupplierId,
  finishOrder,
  getCallstatusForSuddenOrders,
  suddenOrdersDisplay,
};
