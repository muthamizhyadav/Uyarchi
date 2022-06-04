const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Supplier } = require('../models');
const { Product } = require('../models/product.model');
const createSupplier = async (supplierBody) => {
  return Supplier.create(supplierBody);
};

const getAllSupplier = async () => {
  return Supplier.find({ active: true });
};

const getAllDisableSupplier = async () => {
  return await Supplier.find({ active: { $eq: false } });
};

const getDisableSupplierById = async (id) => {
  const supplier = Supplier.findById(id);
  if (!supplier || supplier.active === false) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier Not  Found OR Suplier Not Disabled');
  }
  return supplier;
};

const updateDisableSupplierById = async (id) => {
  let supplier = await getDisableSupplierById(id);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'supplier not found');
  }
  supplier = await Supplier.findByIdAndUpdate({ _id: id }, { active: false, archive: true }, { new: true });
  return supplier;
};

const productDealingWithsupplier = async (id, date) => {
  return Supplier.aggregate([
    {
      $match: {
        productDealingWith: {
          $eq: id,
        },
      },
    },
    {
      $lookup: {
        from: 'products',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', id], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
        ],
        as: 'products',
      },
    },
    {
      $unwind: '$products',
    },
    {
      $lookup: {
        from: 'status',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$productid', id], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
          {
            $match: {
              $expr: {
                $eq: ['$date', date], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
        ],
        as: 'productstatus',
      },
    },
    {
      $unwind: '$productstatus',
    },
    {
      $lookup: {
        from: 'callstatuses',
        localField: '_id',
        foreignField: 'supplierid',
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$date', date], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
          {
            $match: {
              $expr: {
                $eq: ['$productid', id], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
        ],
        as: 'callStatus',
      },
    },
  ]);
};

const getSupplierWithApprovedstatus = async (id) => {
  return Supplier.aggregate([
    {
      $match: {
        productDealingWith: {
          $eq: id,
        },
      },
    },
  ]);
};

const getSupplierById = async (id) => {
  let values = [];
  let supplier = await Supplier.findById(id);
  for (let i = 0; i < supplier.productDealingWith.length; i++) {
    let ff = await Product.findById(supplier.productDealingWith[i]);
    values.push(ff);
  }
  console.log(values);
  return {
    supplier: supplier,
    products: values,
  };
};

const updateSupplierById = async (supplierId, updateBody) => {
  let supplier = await getSupplierById(supplierId);
  console.log(supplier);
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

const recoverById = async (supplierId) => {
  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Supplier not found');
  }
  (supplier.active = true), (supplier.archive = false), await supplier.save();
  return supplier;
};

module.exports = {
  createSupplier,
  updateSupplierById,
  getAllSupplier,
  getSupplierWithApprovedstatus,
  productDealingWithsupplier,
  updateDisableSupplierById,
  getSupplierById,
  getDisableSupplierById,
  deleteSupplierById,
  recoverById,
  getAllDisableSupplier,
};
