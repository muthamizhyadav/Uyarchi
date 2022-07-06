const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const SupplierBills = require('../models/supplierBills.model');
const ReceivedProduct = require('../models/receivedProduct.model');

const createSupplierbills = async (body) => {
  const { groupId, pendingAmount } = body;
  await ReceivedProduct.findByIdAndUpdate({ _id: groupId }, { pendingAmount: pendingAmount }, { new: true });
  let supplierbills = await SupplierBills.create(body);
  return supplierbills;
};

module.exports = {
  createSupplierbills,
};
