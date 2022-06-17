const httpStatus = require('http-status');
const { CallStatus } = require('../models');
const ApiError = require('../utils/ApiError');

const createCallStatus = async (callStatusBody) => {
  return CallStatus.create(callStatusBody);
};

const getCallStatusById = async (id) => {
  return CallStatus.findById(id);
};

const totalAggregation = async () => {
  return CallStatus.aggregate([{ $group: { _id: null, TotalPhApproved: { $sum: '$phApproved' } } }]);
};

const getDataByVehicleNumber = async (vehicleNumber, date, page) => {
  let values = await CallStatus.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }, { vehicleNumber: { $eq: vehicleNumber } }],
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await CallStatus.find({ vehicleNumber: { $eq: vehicleNumber } }).count();
  return {
    value: values,
    total: total,
  };
};

const getAcknowledgedData = async (date, page) => {
  let values = await CallStatus.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productsdata',
      },
    },
    {
      $unwind: '$productsdata',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'suppliersdata',
      },
    },
    {
      $unwind: '$suppliersdata',
    },
    {
      $project: {
        productName: '$productsdata.productTitle',
        SupplierName: '$suppliersdata.primaryContactName',
        vehicleNumber: 1,
        driverName: 1,
        vehicleType: 1,
        driverNumber: 1,
        weighbridgeBill: 1,
        date: 1,
        confirmcallstatus:1,
        incomingWastage:1,
        stockStatus: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await CallStatus.find({ date: { $eq: date } }).count();
  return {
    value: values,
    total: total,
  };
};

const getAcknowledgedDataforLE = async (date, page) => {
  let values = await CallStatus.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }, { stockStatus: { $ne: 'Pending' } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productsdata',
      },
    },
    {
      $unwind: '$productsdata',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'suppliersdata',
      },
    },
    {
      $unwind: '$suppliersdata',
    },
    {
      $project: {
        productName: '$productsdata.productTitle',
        SupplierName: '$suppliersdata.primaryContactName',
        vehicleNumber: 1,
        driverName: 1,
        driverNumber:1,
        vehicleType: 1,
        vehicleNumber: 1,
        weighbridgeBill: 1,
        date: 1,
        confirmcallstatus:1,
        incomingWastage:1,
        stockStatus: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await CallStatus.find({ stockStatus: { $ne: 'Pending' } }).count();
  return {
    value: values,
    total: total,
  };
};

const getOnlyLoadedData = async (date, page) => {
  let values = await CallStatus.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }, { stockStatus: { $eq: 'Loaded' } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productsdata',
      },
    },
    {
      $unwind: '$productsdata',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'suppliersdata',
      },
    },
    {
      $unwind: '$suppliersdata',
    },
    {
      $project: {
        productName: '$productsdata.productTitle',
        SupplierName: '$suppliersdata.primaryContactName',
        vehicleNumber: 1,
        driverName: 1,
        driverNumber:1,
        vehicleType: 1,
        vehicleNumber: 1,
        weighbridgeBill: 1,
        date: 1,
        stockStatus: 1,
        confirmOrder:1,
        confirmcallDetail:1,
        incomingQuantity:1,
        confirmcallstatus:1,
        incomingWastage:1,
        confirmprice:1,
        phApproved:1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await CallStatus.find({ stockStatus: { $eq: 'Loaded' } }).count();
  return {
    value: values,
    total: total,
  };
};

const getAllConfirmStatus = async (id) => {
  return await CallStatus.aggregate([
    {
      $match: {
        $and: [{ productid: { $eq: id } }, { confirmcallstatus: { $eq: 'Accepted' } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productsdata',
      },
    },
    {
      $unwind: '$productsdata',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierid',
        foreignField: '_id',
        as: 'suppliersdata',
      },
    },
    {
      $unwind: '$suppliersdata',
    },
    {
      $project: {
        qtyOffered: 1,
        strechedUpto: 1,
        price: 1,
        status: 1,
        requestAdvancePayment: 1,
        callstatus: 1,
        callDetail: 1,
        date: 1,
        time: 1,
        phApproved: 1,
        phStatus: 1,
        phreason: 1,
        confirmOrder: 1,
        confirmcallDetail: 1,
        confirmcallstatus: 1,
        confirmprice: 1,
        supplier: '$suppliersdata',
        product: '$productsdata',
      },
    },
  ]);
};

const getProductAndSupplierDetails = async (date, page) => {
  let details = await CallStatus.aggregate([
    {
      $match: {
        $and: [{ date: { $eq: date } }, { confirmcallstatus: { $eq: 'Accepted' } }],
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productid',
        foreignField: '_id',
        as: 'productsdata',
      },
    },
    {
      $unwind: '$productsdata',
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
        supplierName: '$supplierData.primaryContactName',
        productTitle: '$productsdata.productTitle',
        date: 1,
        qtyOffered: 1,
        strechedUpto: 1,
        price: 1,
        callstatus: 1,
        confirmcallstatus: 1,
        time: 1,
        phApproved: 1,
        phStatus: 1,
        phreason: 1,
        confirmOrder: 1,
        confirmcallstatus:1,
        incomingWastage:1,
        confirmcallDetail: 1,
        confirmcallstatus: 1,
        confirmcallstatus:1,
        incomingWastage:1,
        confirmprice: 1,
        stockStatus: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);

  let total = await CallStatus.find({ confirmcallstatus: { $eq: 'Accepted' } }).count();
  return {
    value: details,
    total: total,
  };
};

const updateCallStatusById = async (id, updateBody) => {
  let callstatus = await getCallStatusById(id);
  if (!callstatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CallStatus  not found');
  }
  callstatus = await CallStatus.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return callstatus;
};

const AddVehicleDetailsInCallStatus = async (id, updateBody) => {
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

module.exports = {
  createCallStatus,
  getCallStatusById,
  getDataByVehicleNumber,
  updateCallStatusById,
  AddVehicleDetailsInCallStatus,
  deleteCallStatusById,
  getProductAndSupplierDetails,
  getOnlyLoadedData,
  totalAggregation,
  getAllConfirmStatus,
  getAcknowledgedDataforLE,
  getAcknowledgedData,
};
