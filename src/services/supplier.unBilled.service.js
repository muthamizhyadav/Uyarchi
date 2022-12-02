const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { SupplierUnbilled, SupplierUnbilledHistory } = require('../models/supplier.Unbilled.model');
const moment = require('moment');
const CallStatus = require('../models/callStatus');
const Supplier = require('../models/supplier.model');
const supplierBills = require('../models/supplierBills.model');
const ReceivedProduct = require('../models/receivedProduct.model');
const { RaisedUnBilled } = require('../models/supplier.raised.unbilled.model');

const createSupplierUnBilled = async (body) => {
  const { supplierId, un_Billed_amt } = body;
  const sunbilled = await SupplierUnbilled.findOne({ supplierId: supplierId });
  if (!sunbilled) {
    let values = await SupplierUnbilled.create({ ...body, ...{ date: moment().format('YYYY-MM-DD'), created: moment() } });
    await SupplierUnbilledHistory.create({
      ...body,
      ...{ date: moment().format('YYYY-MM-DD'), created: moment(), un_BilledId: values._id },
    });
    return values;
  } else {
    let unBamt = parseInt(un_Billed_amt);
    let existamt = parseInt(sunbilled.un_Billed_amt);
    let total = unBamt + existamt;
    let value = await SupplierUnbilled.findByIdAndUpdate(
      { _id: sunbilled._id },
      { un_Billed_amt: total, date: moment().format('YYYY-MM-DD'), created: moment() },
      { new: true }
    );
    await SupplierUnbilledHistory.create({
      ...body,
      ...{ date: moment().format('YYYY-MM-DD'), created: moment(), un_BilledId: value._id },
    });
    return value;
  }
};

const getUnBilledBySupplier = async () => {
  let values = await SupplierUnbilled.aggregate([
    {
      $lookup: {
        from: 'suppliers',
        localField: 'supplierId',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'callstatuses',
              localField: '_id',
              foreignField: 'supplierid',
              pipeline: [
                { $match: { status: 'Advance' } },
                { $group: { _id: null, TotalAdvance: { $sum: '$TotalAmount' } } },
              ],
              as: 'suppplierOrders',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$suppplierOrders',
            },
          },
          {
            $lookup: {
              from: 'supplierraisedunbilleds',
              localField: '_id',
              foreignField: 'supplierId',
              as: 'suppplierUnbilled',
            },
          },
          {
            $unwind: {
              preserveNullAndEmptyArrays: true,
              path: '$suppplierUnbilled',
            },
          },
        ],
        as: 'suppliers',
      },
    },
    {
      $unwind: '$suppliers',
    },
    {
      $lookup: {
        from: 'supplierunbilledhistories',
        localField: 'supplierId',
        foreignField: 'supplierId',
        pipeline: [
          {
            $group: { _id: null, TotalUnbilled: { $sum: '$un_Billed_amt' } },
          },
        ],
        as: 'unBilledHistory',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$unBilledHistory',
      },
    },
    {
      $project: {
        _id: 1,
        un_Billed_amt: 1,
        date: 1,
        supplierName: '$suppliers.primaryContactName',
        total_UnbilledAmt: '$unBilledHistory.TotalUnbilled',
        supplierId: '$suppliers._id',
        suppliersRaisedUnBill: {
          $ifNull: [{ $subtract: ['$suppliers.suppplierUnbilled.raised_Amt', '$un_Billed_amt'] }, 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        un_Billed_amt: 1,
        date: 1,
        supplierName: 1,
        total_UnbilledAmt: 1,
        supplierId: 1,
        suppliersRaisedUnBill: {
          $cond: [{ $lte: ['$suppliersRaisedUnBill', 0] }, 0, 0],
        },
      },
    },
  ]);
  return values;
};

const getSupplierAdvance = async (supplierId) => {
  let values = await CallStatus.aggregate([
    {
      $match: { supplierid: supplierId, status: 'Advance' },
    },
    {
      $group: { _id: null, totalAdvance: { $sum: '$TotalAmount' } },
    },
  ]);
  return values;
};

const getSupplierOrdered_Details = async (id) => {
  let values = await CallStatus.aggregate([
    {
      $match: { supplierid: id },
    },
    {
      $project: {
        _id: 1,
        totalAmounts: { $ifNull: [{ $multiply: ['$confirmOrder', '$confirmprice'] }, 0] },
        date: 1,
        status: 1,
        date: 1,
        AdvanceRaised: { $ifNull: ['$TotalAmount', 0] },
        orderId: { $ifNull: ['$OrderId', 'oldData'] },
      },
    },
  ]);
  return values;
};

const Unbilled_Details_bySupplier = async (id) => {
  const supplier = await SupplierUnbilledHistory.aggregate([
    {
      $match: { supplierId: { $eq: id } },
    },
  ]);
  let supplierDetails = await Supplier.findById(id);
  return { values: supplier, supplierDetails: supplierDetails };
};

const getSupplierbill_amt = async (page) => {
  let values = await Supplier.aggregate([
    {
      $lookup: {
        from: 'receivedproducts',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [
          {
            $match: {
              status: { $eq: 'Billed' },
            },
          },
          {
            $lookup: {
              from: 'receivedstocks',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [
                { $match: { status: { $eq: 'Billed' } } },
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: {
                        $multiply: ['$billingQuantity', '$billingPrice'],
                      },
                    },
                  },
                },
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
                      $sum: '$Amount',
                    },
                  },
                },
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
              paidAmount: { $ifNull: ['$supplierbills.amount', 0] },
              totalAmount: { $ifNull: ['$receivedstocks.amount', 0] },
            },
          },
          {
            $project: {
              paidAmount: 1,
              totalAmount: 1,
              pendingAmount: { $subtract: ['$totalAmount', '$paidAmount'] },
              match: { $eq: ['$totalAmount', '$paidAmount'] },
            },
          },
          {
            $match: { match: { $ne: true } },
          },
          {
            $group: {
              _id: null,
              pendingBillcount: { $sum: 1 },
              pendingAmount: { $sum: '$pendingAmount' },
            },
          },
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
        from: 'supplierunbilleds',
        localField: '_id',
        foreignField: 'supplierId',
        as: 'supplierbills',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$supplierbills',
      },
    },
    {
      $lookup: {
        from: 'supplierbills',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [{ $sort: { created: -1 } }, { $limit: 1 }],
        as: 'supplierbill',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$supplierbill',
      },
    },
    {
      $project: {
        _id: 1,
        primaryContactName: 1,
        totalPending_amt: { $ifNull: ['$receivedproducts.pendingAmount', 0] },
        current_UnBilled_amt: { $ifNull: ['$supplierbills.un_Billed_amt', 0] },
        lastPaid: { $ifNull: ['$supplierbill.Amount', 0] },
      },
    },
    {
      $match: { totalPending_amt: { $gt: 0 } },
    },
    {
      $skip: 10 * page,
    },
    { $limit: 10 },
  ]);
  let total = await Supplier.aggregate([
    {
      $lookup: {
        from: 'receivedproducts',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [
          {
            $match: {
              status: { $eq: 'Billed' },
            },
          },
          {
            $lookup: {
              from: 'receivedstocks',
              localField: '_id',
              foreignField: 'groupId',
              pipeline: [
                { $match: { status: { $eq: 'Billed' } } },
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: {
                        $multiply: ['$billingQuantity', '$billingPrice'],
                      },
                    },
                  },
                },
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
                      $sum: '$Amount',
                    },
                  },
                },
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
              paidAmount: { $ifNull: ['$supplierbills.amount', 0] },
              totalAmount: { $ifNull: ['$receivedstocks.amount', 0] },
            },
          },
          {
            $project: {
              paidAmount: 1,
              totalAmount: 1,
              pendingAmount: { $subtract: ['$totalAmount', '$paidAmount'] },
              match: { $eq: ['$totalAmount', '$paidAmount'] },
            },
          },
          {
            $match: { match: { $ne: true } },
          },
          {
            $group: {
              _id: null,
              pendingBillcount: { $sum: 1 },
              pendingAmount: { $sum: '$pendingAmount' },
            },
          },
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
        from: 'supplierunbilleds',
        localField: '_id',
        foreignField: 'supplierId',
        as: 'supplierbills',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$supplierbills',
      },
    },
    {
      $lookup: {
        from: 'supplierbills',
        localField: '_id',
        foreignField: 'supplierId',
        pipeline: [{ $sort: { created: -1 } }, { $limit: 1 }],
        as: 'supplierbill',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$supplierbill',
      },
    },
    {
      $project: {
        _id: 1,
        primaryContactName: 1,
        totalPending_amt: { $ifNull: ['$receivedproducts.pendingAmount', 0] },
        current_UnBilled_amt: { $ifNull: ['$supplierbills.un_Billed_amt', 0] },
        lastPaid: { $ifNull: ['$supplierbill.Amount', 0] },
      },
    },
    {
      $match: { totalPending_amt: { $gt: 0 } },
    },
  ]);
  return { values: values, total: total.length };
};

const getBillDetails_bySupplier = async (id) => {
  let values = await supplierBills.aggregate([
    { $match: { supplierId: id } },
    {
      $lookup: {
        from: 'receivedproducts',
        localField: 'groupId',
        foreignField: '_id',
        as: 'received',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$received',
      },
    },
    {
      $project: {
        _id: 1,
        Amount: 1,
        paymentMethod: 1,
        supplierId: 1,
        Billno: '$received.BillNo',
        date: '$received.date',
      },
    },
  ]);
  let supplier = await Supplier.findById(id);
  return { values: values, supplier: supplier };
};

const supplierOrders_amt_details = async (id) => {
  let values = await ReceivedProduct.aggregate([
    {
      $match: { supplierId: id },
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
        pipeline: [{ $group: { _id: null, billingTotal: { $sum: '$Amount' } } }],
        as: 'supplierBills',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$supplierBills',
      },
    },
    {
      $project: {
        _id: 1,
        supplierId: 1,
        date: 1,
        BillNo: 1,
        TotalAmt: { $ifNull: ['$ReceivedData.billingTotal', 0] },
        paidAmount: { $ifNull: ['$supplierBills.billingTotal', 0] },
        PendingAmount: { $ifNull: [{ $subtract: ['$ReceivedData.billingTotal', '$supplierBills.billingTotal'] }, 0] },
      },
    },
    {
      $match: { PendingAmount: { $gt: 0 } },
    },
  ]);
  let supplier = await Supplier.findById(id);
  return { values: values, supplier: supplier };
};

const getPaid_history = async (id) => {
  let values = await supplierBills.aggregate([
    {
      $match: { groupId: id },
    },
  ]);
  let supplier = await Supplier.findById(id);
  return values;
};

const billAdjust = async (body) => {
  let { arr, supplierId, amount } = body;
  let values = await SupplierUnbilled.findOne({ supplierId: supplierId });
  if (values.un_Billed_amt < amount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invaid amount');
  }
  const pending = await ReceivedProduct.aggregate([
    {
      $match: { $and: [{ _id: { $in: arr } }] },
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
        pipeline: [{ $group: { _id: null, billingTotal: { $sum: '$Amount' } } }],
        as: 'supplierBills',
      },
    },
    {
      $unwind: {
        preserveNullAndEmptyArrays: true,
        path: '$supplierBills',
      },
    },
    {
      $project: {
        _id: 1,
        PendingAmount: { $ifNull: [{ $subtract: ['$ReceivedData.billingTotal', '$supplierBills.billingTotal'] }, 0] },
      },
    },
  ]);
  if (pending.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pending Bill Not Available');
  }

  pending.forEach(async (e) => {
    if (amount > 0) {
      let pendingamount = e.PendingAmount;
      console.log(pendingamount);
      if (pendingamount > 0) {
        let reduceAmount = amount - pendingamount;
        if (reduceAmount >= 0) {
          amount = amount - pendingamount;
          await supplierBills.create({
            status: 'Paid',
            groupId: e._id,
            Amount: pendingamount,
            paymentMethod: 'Adjusted',
            supplierId: supplierId,
            created: moment(),
            date: moment().format('YYYY-MM-DD'),
          });
        } else {
          reduceAmount = amount;
          amount = 0;
          await supplierBills.create({
            status: 'Paid',
            groupId: e._id,
            Amount: reduceAmount,
            paymentMethod: 'Adjusted',
            supplierId: supplierId,
            created: moment(),
            date: moment().format('YYYY-MM-DD'),
          });
        }
      }
    }
  });

  values = await SupplierUnbilled.findByIdAndUpdate(
    { _id: values._id },
    { un_Billed_amt: values.un_Billed_amt - body.amount },
    { new: true }
  );
  return values;
};

const PayPendingAmount = async (body) => {
  const { supplierId, amount, arr, pay_method } = body;
  if (arr.length == 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Bill Not Available');
  }
  arr.forEach(async (e) => {
    let values = await ReceivedProduct.findById(e);
    await supplierBills.create({
      status: 'Paid',
      groupId: values._id,
      Amount: amount,
      paymentMethod: pay_method,
      supplierId: supplierId,
      created: moment(),
      date: moment().format('YYYY-MM-DD'),
    });
  });
  return { message: 'successFully paid' };
};

module.exports = {
  createSupplierUnBilled,
  getUnBilledBySupplier,
  getSupplierAdvance,
  getSupplierOrdered_Details,
  Unbilled_Details_bySupplier,
  getSupplierbill_amt,
  getBillDetails_bySupplier,
  supplierOrders_amt_details,
  getPaid_history,
  billAdjust,
  PayPendingAmount,
};
