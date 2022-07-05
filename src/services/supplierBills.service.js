const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const SupplierBills = require('../models/supplierBills.model');

const createSupplierbills = async (body) => {
  let supplierbills = await SupplierBills.create(body);
  return supplierbills;
};

module.exports = {
  createSupplierbills,
};
