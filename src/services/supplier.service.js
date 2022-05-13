const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Supplier } = require('../models');

const createSupplier = async (supplierBody) => {
  return Supplier.create(supplierBody);
};

const getAllSupplier = async () => {
  return Supplier.find({active : true});
};

const getAllDisableSupplier = async () =>{
  return await Supplier.find({ active: { $eq: false } })
} 

const getDisableSupplierById = async (id) => {
  const supplier = Supplier.findById(id);
  if(!supplier || supplier.active === true){
    throw new ApiError(httpStatus.NOT_FOUND, "Supplier Not  Found OR Suplier Not Disabled")
  }
  return supplier;
};

const updateDisableSupplierById = async (id) => {
  let supplier = await getDisableSupplierById(id)
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'supplier not found');
  }
  supplier = await Supplier.findByIdAndUpdate({ _id:id }, {active: true, archive : false}, { new: true });
  return supplier;
};

const getSupplierById = async (id) => {
  const supplier = Supplier.findById(id);
  if(!supplier || supplier.active === false){
    throw new ApiError(httpStatus.NOT_FOUND, "Supplier Not Found")
  }
  return supplier;
};

const updateSupplierById = async (id, updateBody) => {
  let supplier = await getSupplierById(id)
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
  updateDisableSupplierById,
  getSupplierById,
  getDisableSupplierById,
  deleteSupplierById,
  recoverById,
  getAllDisableSupplier,
};
