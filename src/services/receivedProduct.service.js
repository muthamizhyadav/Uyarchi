const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const ReceivedProduct = require('../models/receivedProduct.model');
const transportbill = require('../models/transportbill.model');

const createReceivedProduct = async (body) => {
  let Rproduct = await ReceivedProduct.create(body);
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
      },
    },
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
    // {
    //   $unwind: '$TotalPaidExpensesData',
    // },
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
        TotalExpense: '$TotalExpenseData.Counts',
        transportHistory: '$transportBillData',
        BillNo: 1,
        TotalPaidExpensesData: '$TotalPaidExpensesData',
      },
    },
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

const getAllWithPaginationBilled_Supplier = async (page, status) => {
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
        BillNo: 1,
      },
    },
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

module.exports = {
  createReceivedProduct,
  getAllWithPagination,
  updateReceivedProduct,
  deleteReceivedProduct,
  BillNumber,
  getAllWithPaginationBilled,
  getAllWithPaginationBilled_Supplier,
};
