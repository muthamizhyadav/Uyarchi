const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Supplier = require('../models/supplier.model');
const { Product } = require('../models/product.model');
const { ProductorderSchema } = require('../models/shopOrder.model');
const CallStatus = require('../models/callStatus');
const B2bBillStatus = require('../models/b2bbillStatus.model');
const moment = require('moment');

const createSupplier = async (supplierBody) => {
  const check = await Supplier.findOne({ primaryContactNumber: supplierBody.primaryContactNumber })
  console.log(check)
  if (check) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Already Register this Number');
  }
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
        let: { supplierid: '$_id' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$$supplierid', '$supplierid'] }] } } },
          { $match: { date: date } },
          {
            $lookup: {
              from: 'products',
              localField: 'productid',
              foreignField: '_id',
              as: 'productData',
            },
          },
          {
            $unwind: '$productData',
          },
          {
            $project: {
              productName: '$productData.productTitle',
              qtyOffered: 1,
              strechedUpto: 1,
              price: 1,
              date: 1,
              callstatus: 1,
              status: 1,
            },
          },
        ],
        as: 'Supplierdata',
      },
    },
  ]);
};

const getSupplierAmountDetailsForSupplierBills = async (page) => {
  let values = await Supplier.aggregate([
    {
      $lookup: {
        from: 'callstatuses',
        localField: '_id',
        foreignField: 'supplierid',
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $gt: ['$PendingTotalConfirmedAmt', 0] }, { $eq: ['$stockStatus', 'Billed'] }],
              },
            },
          },
        ],
        as: 'callstatusData',
      },
    },
    {
      $project: {
        TotalPendingAmt: { $sum: '$callstatusData.PendingTotalConfirmedAmt' },
        TotalPendingBills: { $size: '$callstatusData.PendingTotalConfirmedAmt' },
        supplierid: '$callstatusData.supplierid',
        primaryContactName: 1,
        _id: 1,
      },
    },
  ]);
  return values;
};

const getSupplierPaymentDetailsBySupplierId = async (id) => {
  let values = B2bBillStatus.aggregate([
    {
      $match: {
        $and: [{ supplierId: { $eq: id } }],
      },
    },
  ]);
  return values;
};

const updateDisableSupplierById = async (id) => {
  let supplier = await getDisableSupplierById(id);
  if (!supplier) {
    throw new ApiError(httpStatus.NOT_FOUND, 'supplier not found');
  }
  supplier = await Supplier.findByIdAndUpdate({ _id: id }, { active: false, archive: true }, { new: true });
  return supplier;
};

const productDealingWithsupplier = async (id) => {
  let currentDate = moment().format('YYYY-MM-DD');
  let currentDateorder = moment().format('DD-MM-YYYY');
  let Suppliers = await Supplier.aggregate([
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
                $eq: ['$date', currentDate], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
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
                $eq: ['$date', currentDate], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
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
          {

            $match: {
              $expr: {
                $ne: ['$orderType', 'sudden'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
        ],
        as: 'callStatus',
      },
    },
  ]);
  let today = moment().format("YYYY-MM-DD")
  let product = await Product.aggregate([
    { $match: { _id: { $eq: id } } },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'productid',
        pipeline: [
          { $match: { date: { $eq: today } } },
          { $group: { _id: null, Qty: { $sum: '$quantity' }, Avg: { $avg: '$priceperkg' } } },
        ],
        as: 'productorders',
      },
    },
    {
      $unwind: {
        path: '$productorders',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'estimatedorders',
        localField: '_id',
        foreignField: 'productId',
        pipeline: [
          { $match: { date: { $eq: today } } },
        ],
        as: 'estimatedorders',
      },
    },
    {
      $unwind: {
        path: '$estimatedorders',
        preserveNullAndEmptyArrays: true,
      },
    }, {
      $project: {
        _id: 1,
        productTitle: 1,
        estimatedQTY: "$estimatedorders.closedQty",
        liveStock: "$productorders.Qty",
      }
    }
  ])

  return { Supplier: Suppliers, product: product[0] }
};

const getSupplierDataByProductId = async (id) => {
  let values = await Supplier.aggregate([
    {
      $match: {
        productDealingWith: {
          $eq: id,
        },
      },
    },
  ]);
  return values;
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


const getSupplierWith_Advanced = async () => {
  let values = await Supplier.aggregate([{
    $lookup: {
      from: 'callstatuses',
      localField: '_id',
      foreignField: 'supplierid',
      pipeline: [{ $match: { status: "Advance" } }, { $group: { _id: null, totalAdvancedAmt: { $sum: '$TotalAmount' } } }],
      as: 'callstatus',
    },
  },
  {
    $unwind: {
      preserveNullAndEmptyArrays: true,
      path: '$callstatus'
    }
  },
  {
    $project: {
      _id: 1,
      secondaryContactName: 1,
      totalAdvancedAmt: { $ifNull: ['$callstatus.totalAdvancedAmt', 0] }
    }
  }
  ])
  return values
}

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
  getSupplierAmountDetailsForSupplierBills,
  getSupplierPaymentDetailsBySupplierId,
  getSupplierDataByProductId,
  getSupplierWith_Advanced,
};
