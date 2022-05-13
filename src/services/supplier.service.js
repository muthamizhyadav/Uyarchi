const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Supplier } = require('../models');

const createSupplier = async (supplierBody) => {
  return Supplier.create(supplierBody);
};

const getAllSupplier = async () => {
  return Supplier.find({active : true});
};

const getSupplierById = async (id) => {
  const supplier = Supplier.findById(id);
  if(!supplier || supplier.active === false){
    throw new ApiError(httpStatus.NOT_FOUND, "Supplier Not Found")
  }
  return supplier;
};

const updateSupplierById = async (supplierId, updateBody) => {
  let supplier = await getSupplierById(supplierId)
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'supplier not found');
  }
  supplier = await Supplier.findByIdAndUpdate({ _id: supplierId }, updateBody, { new: true });
  return supplier;
};

const deleteSupplierById = async (supplierId) => {
  const supplier = await getSupplierById(supplierId);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }
  (supplier.active = false), (supplier.archive = true), await supplier.save();
  return supplier;
};

const recoverById = async (supplierId)=>{
  const supplier = await getSupplierById(supplierId);
  if(!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier Not Found');
  }
  (supplier.active = true), (supplier.archive = false), await supplier.save();
  return supplier;
}

module.exports = {
  createSupplier,
  updateSupplierById,
  getAllSupplier,
  getSupplierById,
  deleteSupplierById,
  recoverById,
};
