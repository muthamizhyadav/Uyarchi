const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Supplier } = require('../models');
const { Product } = require('../models/product.model');
const { ProductorderSchema } = require('../models/shopOrder.model');
const CallStatus = require('../models/callStatus');
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

const getproductsWithSupplierId = async (supplierId, date) => {
  let supplier = await Supplier.findById(supplierId);
  let product = [];
  let soproductid = [];
  let soproduct = [];
  let productsId = supplier.productDealingWith;
  let productorders = await CallStatus.find({ date: date, supplierid: { $eq: supplierId } });
  let productid = productorders.forEach((e) => {
    soproductid.push(e.productid);
  });
  for (let i = 0; i <= productsId.length; i++) {
    for (let j = 0; j <= soproductid.length; j++) {
      if (productsId[i] == soproductid[j]) {
        let products = await Product.findById(productsId[i]);
        let soproducts = await CallStatus.findOne({
          supplierid: supplierId,
          date: { $eq: date },
          productid: { $eq: productsId[i] },
        });
        console.log(soproducts);
        product.push(products);
        soproduct.push(soproducts);
      }
    }
  }
  return { product: product, soproduct: soproduct };
};

const getproductfromCallStatus = async (date) => {
  return Supplier.aggregate([
    {
      $lookup: {
        from: 'callstatuses',
        let: { supplierid: '$_id'},
        pipeline: [
          { $match:
            { $expr:
               { $and:
                  [
                    { $eq: [ '$$supplierid',  '$supplierid' ] },
                  ]
               }
            }
         },
          { $match: { date: date } },
       ],
       as: "data",
       
      },
    },
  ]);
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

const getSupplierWithApprovedstatus = async (date) => {
  return Supplier.aggregate([
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
            $lookup: {
              from: 'status',
              localField: 'productid',
              foreignField: 'productid',
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$date', date], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
                    },
                  },
                  $match: {
                    $expr: {
                      $eq: ['$status', 'Approved'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
                    },
                  },
                },
              ],
              as: 'status',
            },
          },
          {
            $unwind: '$status',
          },
        ],
        as: 'callstatusData',
        // totalAmount: { $sum: '$phApproved' }
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
  getproductfromCallStatus,
  updateDisableSupplierById,
  getSupplierById,
  getDisableSupplierById,
  deleteSupplierById,
  recoverById,
  getproductsWithSupplierId,
  getAllDisableSupplier,
};
