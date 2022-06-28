const httpStatus = require('http-status');
const b2bBillStatus = require('../models/b2bbillStatus.model');
const ApiError = require('../utils/ApiError');
const CallStatus = require('../models/callStatus');
const moment = require('moment');
let currentDate = moment().format('DD-MM-YYYY');

const createB2bBillStatus = async (body) => {
  let billcount = await b2bBillStatus.find({ date: currentDate }).count();
  console.log(billcount);
  let center = '';
  if (billcount < 9) {
    center = '000000';
  }
  if (billcount < 99 && billcount >= 9) {
    center = '00000';
  }
  if (billcount < 999 && billcount >= 99) {
    center = '0000';
  }
  if (billcount < 9999 && billcount >= 999) {
    center = '000';
  }
  if (billcount < 99999 && billcount >= 9999) {
    center = '00';
  }
  if (billcount < 999999 && billcount >= 99999) {
    center = '0';
  }
  let total = billcount + 1;
  let billid = center + total;

  const { callStatusId, supplierId, date, mislianeousCost, logisticsCost, others, vehicleNumber } = body;
  let totalExpense = mislianeousCost + logisticsCost + others;
  let round = Math.round(totalExpense);
  let value = { ...body, ...{ BillId: billid, totalExpenseAmount: round } };
  let callstatus = await CallStatus.find({vehicleNumber: vehicleNumber, date: date });
  let creations = await b2bBillStatus.create(value);
  callstatus = await CallStatus.updateMany(
    { vehicleNumber: vehicleNumber, date: date },
    { $set: { B2bBillId: creations.id, stockStatus: 'Billed', BillStatus: 'Billed' } },
    { new: true }
  );
  // callstatus = await CallStatus.findByIdAndUpdate({ _id: callStatusId }, { B2bBillId: creations.id }, { new: true });
  return creations;
};

const getDataForAccountExecutive = async (page) => {
  let values = await b2bBillStatus.aggregate([
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplierdata',
      },
    },
    {
      $unwind: '$supplierdata',
    },
    {
      $project: {
        supplierName: '$supplierdata.primaryContactName',
        supplierId: 1,
        _id: 1,
        BillId: 1,
        date: 1,
        callStatusId: 1,
        paymentStatus: 1,
        totalExpenseAmount: 1,
        PendingExpenseAmount: 1,
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await b2bBillStatus.find().count();
  return { values: values, total: total };
};

module.exports = { createB2bBillStatus, getDataForAccountExecutive };
