const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ReceivedProduct = require('../models/receivedProduct.model');
const transportbill = require('../models/transportbill.model');
const Supplier = require('../models/supplier.model');
const ReceivedStock = require('../models/receivedStock.model');

const createReceivedProduct = async (body) => {
  let Rproduct = await ReceivedProduct.create(body);
  return Rproduct;
};

const uploadImageById = async (id, body) => {
  let Rproduct = await ReceivedProduct.findById(id);
  if (!Rproduct) {
    throw new ApiError(404, 'ReceivedProduct not found');
  }
  Rproduct = await ReceivedProduct.findByIdAndUpdate({ _id: id }, body, { new: true });
  return Rproduct;
};

const getAllWithPagination = async (page, status) => {
  let value = await ReceivedProduct.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: status } }],
      },
    },
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Count: { $sum: 1 } } }],
        as: 'ReceivedData',
      },
    },
    {
      $unwind: '$ReceivedData',
    },
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [
          {
            $match: { status: { $eq: 'Billed' } },
          },
          { $group: { _id: null, Count: { $sum: 1 } } },
        ],
        as: 'billedCount',
      },
    },
    {
      $unwind: {
        path: '$billedCount',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplierData',
      },
    },
    {
      $unwind: '$supplierData',
    },
    {
      $project: {
        _id: 1,
        status: 1,
        vehicleType: 1,
        vehicleNumber: 1,
        driverName: 1,
        driverNumber: 1,
        weighBridgeEmpty: 1,
        weighBridgeLoadedProduct: 1,
        supplierId: 1,
        date: 1,
        time: 1,
        supplierName: '$supplierData.primaryContactName',
        supplierContact: '$supplierData.primaryContactNumber',
        Count: '$ReceivedData.Count',
        billedCount: '$billedCount.Count',
      },
    },
    { $skip: 10 * page },
    { $limit: 10 },
  ]);
  let total = await ReceivedProduct.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: status } }],
      },
    },
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Count: { $sum: 1 } } }],
        as: 'ReceivedData',
      },
    },
    {
      $unwind: '$ReceivedData',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplierData',
      },
    },
    {
      $unwind: '$supplierData',
    },
  ]);
  return { values: value, total: total.length };
};

const getAllWithPaginationBilled = async (page, status) => {
  let value = await ReceivedProduct.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: status } }],
      },
    },
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Count: { $sum: 1 } } }],
        as: 'ReceivedData',
      },
    },
    {
      $unwind: '$ReceivedData',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplierData',
      },
    },
    {
      $unwind: '$supplierData',
    },
    {
      $lookup: {
        from: 'transportbills',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [
          {
            $lookup: {
              from: 'expensesbills',
              localField: '_id',
              foreignField: 'billId',
              as: 'TransactionData',
            },
          },
        ],
        as: 'transportBillData',
      },
    },
    {
      $lookup: {
        from: 'expensesbills',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Counts: { $sum: '$Amount' } } }],
        as: 'totalAmt',
      },
    },
    { $unwind: { path: '$totalAmt', preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: 'transportbills',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Counts: { $sum: '$billAmount' } } }],
        as: 'TotalExpenseData',
      },
    },
    {
      $unwind: '$TotalExpenseData',
    },
    {
      $lookup: {
        from: 'expensesbills',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Counts: { $sum: '$Amount' } } }],
        as: 'TotalPaidExpensesData',
      },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        vehicleType: 1,
        vehicleNumber: 1,
        driverName: 1,
        driverNumber: 1,
        weighBridgeEmpty: 1,
        totalAmt: { $ne: ['$totalAmt.Counts', '$TotalExpenseData.Counts'] },
        weighBridgeLoadedProduct: 1,
        supplierId: 1,
        date: 1,
        time: 1,
        supplierName: '$supplierData.primaryContactName',
        supplierContact: '$supplierData.primaryContactNumber',
        Count: '$ReceivedData.Count',
        TotalExpense: '$TotalExpenseData.Counts',
        transportHistory: '$transportBillData',
        BillNo: 1,
        TotalPaidExpensesData: '$TotalPaidExpensesData',
      },
    },
    { $match: { totalAmt: { $eq: true } } },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
  ]);
  let total = await ReceivedProduct.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: status } }],
      },
    },
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Count: { $sum: 1 } } }],
        as: 'ReceivedData',
      },
    },
    {
      $unwind: '$ReceivedData',
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplierData',
      },
    },
    {
      $unwind: '$supplierData',
    },
  ]);
  return { values: value, total: total.length };
};

const getAllWithPaginationBilled_Supplier = async (id, status) => {
  let value = await ReceivedProduct.aggregate([
    {
      $match: {
        $and: [{ status: { $eq: status } }, { supplierId: { $eq: id } }, { pendingAmount: { $ne: 0 } }],
      },
    },
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, billingTotal: { $sum: '$billingTotal' } } }],
        as: 'ReceivedData',
      },
    },
    {
      $unwind: '$ReceivedData',
    },
    {
      $lookup: {
        from: 'supplierbills',
        localField: '_id',
        foreignField: 'groupId',
        pipeline: [{ $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'PaymentDetails',
      },
    },
    {
      $lookup: {
        from: 'supplierbills',
        localField: '_id',
        foreignField: 'groupId',
        // pipeline: [{ $group: { _id: null, Amount: { $sum: '$Amount' } } }],
        as: 'PaymentData',
      },
    },

    {
      $project: {
        _id: 1,
        status: 1,
        vehicleType: 1,
        vehicleNumber: 1,
        driverName: 1,
        driverNumber: 1,
        weighBridgeEmpty: 1,
        weighBridgeLoadedProduct: 1,
        supplierId: 1,
        date: 1,
        time: 1,
        billingTotal: '$ReceivedData.billingTotal',
        BillNo: 1,
        PaymentDetails: '$PaymentDetails',
        PaymentData: '$PaymentData',
        pendingAmount: 1,
      },
    },
  ]);
  let supplier = await Supplier.findById(id);
  return { values: value, supplier: supplier };
};

const updateReceivedProduct = async (id, updateBody) => {
  let receivedProduct = await ReceivedProduct.findById(id);
  if (!receivedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not FOund');
  }
  receivedProduct = await ReceivedProduct.findByIdAndUpdate({ _id: id }, updateBody, { new: true });
  return receivedProduct;
};

const deleteReceivedProduct = async (id) => {
  let receivedProduct = await ReceivedProduct.findById(id);
  if (!receivedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ReceivedProduct Not Found');
  }
  (receivedProduct.active = false), (receivedProduct.archive = true);
  await receivedProduct.save();
};

const BillNumber = async (id, bodydata) => {
  let LoadedProduct = await ReceivedProduct.findById(id);
  if (!LoadedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ReceivedProduct Not Found');
  }
  console.log(LoadedProduct.date);
  let receicedProduct = await ReceivedProduct.find({
    date: LoadedProduct.date,
    status: 'Billed',
  }).count();

  let center = '';
  if (receicedProduct < 9) {
    center = '000000';
  }
  if (receicedProduct < 99 && receicedProduct >= 9) {
    center = '00000';
  }
  if (receicedProduct < 999 && receicedProduct >= 99) {
    center = '0000';
  }
  if (receicedProduct < 9999 && receicedProduct >= 999) {
    center = '000';
  }
  if (receicedProduct < 99999 && receicedProduct >= 9999) {
    center = '00';
  }
  if (receicedProduct < 999999 && receicedProduct >= 99999) {
    center = '0';
  }
  let total = receicedProduct + 1;
  let billid = center + total;
  if (LoadedProduct.status != 'Billed') {
    LoadedProduct = await ReceivedProduct.findByIdAndUpdate(
      { _id: id },
      { status: 'Billed', BillNo: billid },
      { new: true }
    );
    if (bodydata.logisticsCost != null && bodydata.logisticsCost != '') {
      await transportbill.create({
        status: 'Billed',
        billType: 'logisticsCost',
        billAmount: bodydata.logisticsCost,
        groupId: LoadedProduct._id,
      });
    }
    if (bodydata.mislianeousCost != null && bodydata.mislianeousCost != '') {
      await transportbill.create({
        status: 'Billed',
        billType: 'mislianeousCost',
        billAmount: bodydata.mislianeousCost,
        groupId: LoadedProduct._id,
      });
    }
    if (bodydata.others != null && bodydata.others != '') {
      await transportbill.create({
        status: 'Billed',
        billType: 'others',
        billAmount: bodydata.others,
        groupId: LoadedProduct._id,
      });
    }
  }
  return LoadedProduct;
};

const getSupplierBillsDetails = async (page) => {
  let values = await Supplier.aggregate([
    {
      $lookup: {
        from: 'receivedproducts',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [
          {
            $lookup: {
              from: 'supplierbills',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [{ $group: { _id: null, billingTotal: { $sum: '$Amount' } } }],
              as: 'supplierbills',
            },
          },
          { $unwind: { path: '$supplierbills', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'receivedstocks',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [{ $group: { _id: null, billingTotal: { $sum: '$billingTotal' } } }],
              as: 'pendingData',
            },
          },
          {
            $unwind: '$pendingData',
          },
          {
            $project: {
              pendingData: '$pendingData.billingTotal',
              supplierbills: '$supplierbills.billingTotal',
              totalAmt: { $ne: ['$pendingData.billingTotal', '$supplierbills.billingTotal'] },
            },
          },

          {
            $match: { totalAmt: true },
          },
        ],
        as: 'pendingDataall',
      },
    },
    {
      $lookup: {
        from: 'receivedproducts',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [
          {
            $match: {
              $expr: {
                $ne: [0, '$pendingAmount'],
              },
            },
          },
          {
            $lookup: {
              from: 'supplierbills',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [{ $group: { _id: null, Amount: { $sum: '$Amount' } } }],
              as: 'PaymentData',
            },
          },
          {
            $unwind: '$PaymentData',
          },
          // {
          //   $project: {
          //     PaymentData: '$PaymentData',
          //   },
          // },
        ],
        as: 'receivedData',
      },
    },
    {
      $unwind: { path: '$receivedData', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'receivedproducts',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [
          {
            $match: {
              $expr: {
                $ne: [0, '$pendingAmount'], // <-- This doesn't work. Dont want to use `$unwind` before `$match` stage
              },
            },
          },
          { $group: { _id: null, total: { $sum: 1 } } },
        ],
        as: 'receivedDatacount',
      },
    },
    {
      $unwind: '$receivedDatacount',
    },
    {
      $project: {
        // PaymentDatasss: '$pendingDataall',
        PaymentData: { $sum: '$pendingDataall.pendingData' },
        paidamount: { $sum: '$pendingDataall.supplierbills' },
        // receivedData: '$receivedDatacount',
        primaryContactName: 1,
        receivedDatacount: '$receivedDatacount.total',
        primaryContactNumber: 1,
        _id: 1,
      },
    },
    { $match: { PaymentData: { $ne: 0 } } },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
  ]);
  return values;
};

const getreceivedProductBySupplier = async (page) => {
  let values = await ReceivedStock.aggregate([
    {
      $lookup: {
        from: 'receivedstocks',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [
          {
            $lookup: {
              from: 'products',
              localField: 'productId',
              foreignField: '_id',
              as: 'productData',
            },
          },
          {
            $unwind: '$productData',
          },
          // {
          //   $project:{
          //     productName:'$productData.productTitle',
          //     billingQuantity:1,
          //     billingTotal:1,
          //     status:1,
          //     date:1,
          //     Net_Amount: { $multiply: [ "$billingQuantity", "$billingTotal" ] }
          //   }
          // }
        ],
        as: 'ReceivedData',
      },
    },
    // {
    //   $lookup: {
    //     from: 'suppliers',
    //     localField: 'supplierId',
    //     foreignField: '_id',
    //     as: 'supplierData',
    //   },
    // },
    // {
    //   $unwind: '$supplierData',
    // },
    // {
    //   $lookup: {
    //     from: 'products',
    //     localField: 'productId',
    //     foreignField: '_id',
    //     as: 'productData',
    //   },
    // },
    // {
    //   $unwind: '$productData',
    // },
    // {
    //   $project: {
    //     ReceivedData:'$ReceivedData',

    //   }
    // }
  ]);
  return values;
};

module.exports = {
  createReceivedProduct,
  getAllWithPagination,
  updateReceivedProduct,
  deleteReceivedProduct,
  BillNumber,
  getAllWithPaginationBilled,
  getAllWithPaginationBilled_Supplier,
  getSupplierBillsDetails,
  uploadImageById,
  getreceivedProductBySupplier,
};
