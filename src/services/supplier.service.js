const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Supplier } = require('../models');

const createSupplier = async (supplierBody) => {
    return Supplier.create(supplierBody)
  };
 
const getAllSupplier = async ()=>{
    return Supplier.find()
}  

const getSupplierById = async (id) => {
    const supplier = Supplier.findById(id);
    return supplier
  };
  
//   const deleteSupplierById = async (supplierId) => {
//     const supplier = await getStreetById(supplierId);
//     if (!supplier) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'supplier not found');
//     }
//     await street.save() 
//     return street;
//   };
  module.exports = {
      createSupplier,
      getAllSupplier,
      getSupplierById,
  }