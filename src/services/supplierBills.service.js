const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const SupplierBills = require('../models/supplierBills.model');
const ReceivedProduct = require('../models/receivedProduct.model');
const moment = require('moment');
const createSupplierbills = async (body) => {
  const { groupId, pendingAmount } = body;
  let currentTime = moment().format('HHmmss');
  let currentDate = moment().format('YYYY-MM-DD');
  let values = { ...body, ...{ created: moment(), time: currentTime, date: currentDate } };
  await ReceivedProduct.findByIdAndUpdate({ _id: groupId }, { pendingAmount: pendingAmount }, { new: true });
  let supplierbills = await SupplierBills.create(values);
  return supplierbills;
};

module.exports = {
  createSupplierbills,
};
