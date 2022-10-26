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
        created: 1,
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
      $skip: 10 * page,
    },
    {
      $limit: 10,
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
        supplierBillImg: 1,
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

const getSupplierDetailByGroupId = async (id) => {
  let values = await ReceivedProduct.aggregate([
    {
      $match: { _id: id },
    },
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        as: 'suppliers',
      },
    },
    {
      $unwind: '$suppliers',
    },
    {
      $project: {
        _id: '$suppliers._id',
        primaryContactName: '$suppliers.primaryContactName',
        primaryContactNumber: '$suppliers.primaryContactNumber',
        secondaryContactName: '$suppliers.secondaryContactName',
        secondaryContactNumber: '$suppliers.secondaryContactNumber',
      },
    },
  ]);
  if (values.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return values[0];
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

const getSupplierBillsDetails = async (page, find) => {
  match = [{ active: true }]
  if (find != 'null') {
    match = [
      { primaryContactName: { $regex: find, $options: 'i' } },
      {
        primaryContactNumber: { $regex: find, $options: 'i' }
      }
    ]
  }
  let values = await Supplier.aggregate([
    {
      $match: {
        $or: match
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
              status: { $eq: "Billed" }
            }
          },
          {
            $lookup: {
              from: 'receivedstocks',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [
                { $match: { status: { $eq: "Billed" } } },
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: {
                        $multiply: ['$billingQuantity', '$billingPrice'],
                      },
                    },
                  }
                }
              ],
              as: 'receivedstocks',
            },
          },
          {
            $lookup: {
              from: 'supplierbills',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: "$Amount"
                    },
                  }
                }
              ],
              as: 'supplierbills',
            },
          },
          {
            $unwind: {
              path: '$supplierbills',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$receivedstocks',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {

              paidAmount: { $ifNull: ["$supplierbills.amount", 0] },
              totalAmount: { $ifNull: ["$receivedstocks.amount", 0] },
            }
          },
          {
            $project: {
              paidAmount: 1,
              totalAmount: 1,
              pendingAmount: { $subtract: ["$totalAmount", "$paidAmount"] },
              match: { $eq: ["$totalAmount", "$paidAmount"] }
            }
          },
          {
            $match: { match: { $ne: true } }
          },
          {
            $group: {
              _id: null,
              pendingBillcount: { $sum: 1 },
              pendingAmount: { $sum: "$pendingAmount" }
            }
          }
        ],
        as: 'receivedproducts',
      },
    },
    {
      $unwind: {
        path: '$receivedproducts',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'supplierbills',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [
          {
            $sort: { created: -1 }
          },
          {
            $limit: 10,
          },
          {
            $skip: 10 * page,
          },
        ],
        as: 'supplierbills',
      },
    },
    {
      $project: {
        _id: 1,
        tradeName: 1,
        companytype: 1,
        primaryContactName: 1,
        primaryContactNumber: 1,
        secondaryContactName: 1,
        secondaryContactNumber: 1,
        RegisteredAddress: 1,
        countries: 1,
        state: 1,
        district: 1,
        gstNo: 1,
        email: 1,
        pinCode: 1,
        gpsLocat: 1,
        pendingAmount: "$receivedproducts.pendingAmount",
        pendingBillcount: "$receivedproducts.pendingBillcount",
        supplierbills: "$supplierbills",
        // lastBill: "$supplierbillsONE"
      }
    },
    {
      $match: { pendingAmount: { $ne: 0 } }
    },
    {
      $limit: 10,
    },
    {
      $skip: 10 * page,
    },
  ]);
  let total = await Supplier.aggregate([
    {
      $match: {
        $or: match
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
              status: { $eq: "Billed" }
            }
          },
          {
            $lookup: {
              from: 'receivedstocks',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [
                { $match: { status: { $eq: "Billed" } } },
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: {
                        $multiply: ['$billingQuantity', '$billingPrice'],
                      },
                    },
                  }
                }
              ],
              as: 'receivedstocks',
            },
          },
          {
            $lookup: {
              from: 'supplierbills',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: "$Amount"
                    },
                  }
                }
              ],
              as: 'supplierbills',
            },
          },
          {
            $unwind: {
              path: '$supplierbills',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $unwind: {
              path: '$receivedstocks',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {

              paidAmount: { $ifNull: ["$supplierbills.amount", 0] },
              totalAmount: { $ifNull: ["$receivedstocks.amount", 0] },
            }
          },
          {
            $project: {
              paidAmount: 1,
              totalAmount: 1,
              pendingAmount: { $subtract: ["$totalAmount", "$paidAmount"] },
              match: { $eq: ["$totalAmount", "$paidAmount"] }
            }
          },
          {
            $match: { match: { $ne: true } }
          },
          {
            $group: {
              _id: null,
              pendingBillcount: { $sum: 1 },
              pendingAmount: { $sum: "$pendingAmount" }
            }
          }
        ],
        as: 'receivedproducts',
      },
    },

    {
      $unwind: "$receivedproducts"
    },
    {
      $project: {
        _id: 1,
        tradeName: 1,
        companytype: 1,
        primaryContactName: 1,
        primaryContactNumber: 1,
        secondaryContactName: 1,
        secondaryContactNumber: 1,
        RegisteredAddress: 1,
        countries: 1,
        state: 1,
        district: 1,
        gstNo: 1,
        email: 1,
        pinCode: 1,
        gpsLocat: 1,
        pendingAmount: "$receivedproducts.pendingAmount",
        pendingBillcount: "$receivedproducts.pendingBillcount"
      }
    },
    {
      $match: { pendingAmount: { $ne: 0 } }
    },

  ]);
  return { values: values, total: total.length };
};

const getreceivedProductBySupplier = async (page) => {
  let values = await Supplier.aggregate([
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
  getSupplierDetailByGroupId,
};
