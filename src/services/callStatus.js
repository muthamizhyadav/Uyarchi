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

const updateCallStatusById = async (id, updateBody) => {
  let callstatus = await getCallStatusById(id);
  if (!callstatus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CallStatus  not found');
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
  totalAggregation,
  getAllConfirmStatus,
};
