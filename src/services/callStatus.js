const httpStatus = require('http-status');
const { CallStatus } = require('../models');
const Supplier = require('../models/supplier.model');
const ApiError = require('../utils/ApiError');

const createCallStatus = async (callStatusBody) => {
  return CallStatus.create(callStatusBody);
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
          { $match: { confirmcallstatus: 'Accepted', StockReceived: 'Pending' } },
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

module.exports = {
  createCallStatus,
  getCallStatusById,
  updateCallStatusById,
  deleteCallStatusById,
  getProductAndSupplierDetails,
};
