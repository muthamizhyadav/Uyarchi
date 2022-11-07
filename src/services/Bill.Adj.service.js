const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const BillAdjustment = require('../models/Bill.Adj.model');
const AdjbillHistories = require('../models/Adj.Bill.history.model');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');
const OrderPayment = require('../models/orderpayment.model');

// create Bill AdjustMent Flow

const createBill_Adjustment = async (body) => {
  const { shopId, un_Billed_amt, payment_method } = body;
  const getAdjustBillByShop = await BillAdjustment.findOne({ shopId: shopId });
  if (getAdjustBillByShop) {
    let oldAdjAmt = getAdjustBillByShop.un_Billed_amt;
    let newAdjAmt = un_Billed_amt;
    let totalAdjAmt = oldAdjAmt + newAdjAmt;
    await BillAdjustment.findByIdAndUpdate(
      { _id: getAdjustBillByShop._id },
      { un_Billed_amt: totalAdjAmt, payment_method: payment_method },
      { new: true }
    );
    let values = {
      ...body,
      ...{
        created: moment(),
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm:ss'),
        AdjBill_Id: getAdjustBillByShop._id,
      },
    };
    await AdjbillHistories.create(values);
    return { message: 'AdjBillCreated' };
  } else {
    let values1 = {
      ...body,
      ...{ created: moment(), date: moment().format('YYYY-MM-DD'), time: moment().format('HH:mm:ss') },
    };

    const BillAdj = await BillAdjustment.create(values1);
    let values = {
      ...body,
      ...{
        created: moment(),
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm:ss'),
        AdjBill_Id: BillAdj._id,
      },
    };
    await AdjbillHistories.create(values);
    return { message: 'AdjBillCreated' };
  }
};

// get BillAdjustment data By Id

const getBillAdjustment_ById = async (id) => {
  const data = await BillAdjustment.findById(id);
  return data;
};

// get Customer Bills

const getCustomer_bills = async (page) => {
  let values = await BillAdjustment.aggregate([
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopdata',
      },
    },
    {
      $unwind: '$shopdata',
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [
          {
            $lookup: {
              from: 'productorderclones',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $project: {
                    Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
                    GST_Number: 1,
                  },
                },
                {
                  $project: {
                    sum: '$sum',
                    percentage: {
                      $divide: [
                        {
                          $multiply: ['$GST_Number', '$Amount'],
                        },
                        100,
                      ],
                    },
                    value: '$Amount',
                  },
                },
                {
                  $project: {
                    price: { $sum: ['$value', '$percentage'] },
                    value: '$value',
                    GST: '$percentage',
                  },
                },
                { $group: { _id: null, price: { $sum: '$price' } } },
              ],
              as: 'productData',
            },
          },
          {
            $unwind: {
              path: '$productData',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'orderpayments',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: '$paidAmt',
                    },
                  },
                },
              ],
              as: 'orderpayments',
            },
          },
          {
            $unwind: {
              path: '$orderpayments',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
        as: 'shoporder',
      },
    },
    {
      $unwind: {
        path: '$shoporder',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        un_Billed_amt: 1,
        payment_method: 1,
        date: 1,
        shopName: '$shopdata.SName',
        totalAmount: { $ifNull: ['$shoporder.productData.price', 0] },
        paidAmt: { $ifNull: ['$shoporder.orderpayments.amount', 0] },
      },
    },
    {
      $project: {
        _id: 1,
        shopId: 1,
        un_Billed_amt: 1,
        payment_method: 1,
        date: 1,
        shopName: 1,
        totalAmount: 1,
        paidAmt: 1,
        totalPendingAmount: { $round: [{ $subtract: ['$totalAmount', '$paidAmt'] }] },
      },
    },
    { $skip: 10 * page },
    {
      $limit: 10,
    },
  ]);
  let total = await BillAdjustment.aggregate([
    {
      $lookup: {
        from: 'b2bshopclones',
        localField: 'shopId',
        foreignField: '_id',
        as: 'shopdata',
      },
    },
    {
      $unwind: '$shopdata',
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'shopId',
        foreignField: 'shopId',
        pipeline: [
          {
            $lookup: {
              from: 'productorderclones',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $lookup: {
                    from: 'products',
                    localField: 'productid',
                    foreignField: '_id',
                    as: 'products',
                  },
                },
                {
                  $unwind: '$products',
                },
                {
                  $project: {
                    _id: 1,
                    status: 1,
                    orderId: 1,
                    productid: 1,
                    quantity: 1,
                    priceperkg: 1,
                    GST_Number: 1,
                    HSN_Code: 1,
                    packtypeId: 1,
                    packKg: 1,
                    unit: 1,
                    productTitle: '$products.productTitle',
                    created: 1,
                    finalQuantity: 1,
                    finalPricePerKg: 1,
                    GST_Number: 1,
                    GSTamount: {
                      $divide: [{ $multiply: [{ $multiply: ['$finalQuantity', '$priceperkg'] }, '$GST_Number'] }, 100],
                    },
                  },
                },
                { $group: { _id: null, gstTotal: { $sum: '$GSTamount' } } },
              ],
              as: 'productData',
            },
          },
          {
            $unwind: '$productData',
          },
          {
            $lookup: {
              from: 'productorderclones',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: {
                        $multiply: ['$finalQuantity', '$priceperkg'],
                      },
                    },
                  },
                },
              ],
              as: 'productDatadetails',
            },
          },
          {
            $unwind: {
              path: '$productDatadetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'orderpayments',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: '$paidAmt',
                    },
                  },
                },
              ],
              as: 'orderpayments',
            },
          },
          {
            $unwind: {
              path: '$orderpayments',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              total: { $round: [{ $add: ['$productData.gstTotal', '$productDatadetails.amount'] }] },
              orderpayments: '$orderpayments.amount',
            },
          },
          {
            $project: {
              pendingAmt: { $subtract: ['$total', '$orderpayments'] },
            },
          },
          { $group: { _id: null, pendingAmount: { $sum: '$pendingAmt' } } },
        ],
        as: 'shoporder',
      },
    },
    {
      $unwind: {
        path: '$shoporder',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
  return { values: values, total: total.length };
};

const adjustment_bill = async (id, userId) => {
  // console.log(id)
  let shoporder = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [{ shopId: { $eq: id } }, { status: { $eq: 'Delivered' } }, { statusOfBill: { $eq: 'Pending' } }],
      },
    },
    {
      $sort: { date: 1 },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    {
      $unwind: {
        path: '$paymentData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'RE_order_Id',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'orderpayments',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: '$paidAmt',
                    },
                  },
                },
              ],
              as: 'orderpayments',
            },
          },
          {
            $unwind: {
              path: '$orderpayments',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              amount: '$orderpayments.amount',
            },
          },
        ],
        as: 'shoporderclones',
      },
    },
    {
      $unwind: {
        path: '$shoporderclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        reorderamount: { $ifNull: ['$shoporderclones.amount', 0] },
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $project: {
              Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
              GST_Number: 1,
            },
          },
          {
            $project: {
              sum: '$sum',
              percentage: {
                $divide: [
                  {
                    $multiply: ['$GST_Number', '$Amount'],
                  },
                  100,
                ],
              },
              value: '$Amount',
            },
          },
          {
            $project: {
              price: { $sum: ['$value', '$percentage'] },
              value: '$value',
              GST: '$percentage',
            },
          },
          { $group: { _id: null, price: { $sum: '$price' } } },
        ],
        as: 'productData',
      },
    },
    {
      $unwind: {
        path: '$productData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        paidAmount: { $sum: ['$paymentData.price', '$reorderamount'] },
      },
    },
    {
      $project: {
        _id: 1,
        OrderId: 1,
        created: 1,
        paidAmount: 1,
        totalAmount: '$productData.price',
        pendingAmount: { $round: { $subtract: ['$productData.price', '$paidAmount'] } },
      },
    },
  ]);
  // console.log(shoporder)
  if (shoporder.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pending Bill Not Available');
  }
  let billadj = await BillAdjustment.findOne({ shopId: id });
  totalAmount = billadj.un_Billed_amt;
  shoporder.forEach(async (e) => {
    if (totalAmount > 0) {
      let pendingAmount = e.pendingAmount;
      if (pendingAmount > 0) {
        let reduceAmount = totalAmount - pendingAmount;
        if (reduceAmount >= 0) {
          totalAmount = totalAmount - pendingAmount;
          console.log(pendingAmount, 'asdasda');
          await ShopOrderClone.findByIdAndUpdate({ _id: e._id }, { statusOfBill: 'Paid' }, { new: true });
          await OrderPayment.create({
            paidAmt: pendingAmount,
            created: moment(),
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('hhmmss'),
            orderId: e._id,
            payment: 'Adjustment',
            type: 'Adjustment',
            uid: userId,
          });
        } else {
          console.log(reduceAmount, 'asdas');
          console.log(totalAmount, 'asdas');
          reduceAmount = totalAmount;
          totalAmount = 0;
          await OrderPayment.create({
            paidAmt: reduceAmount,
            created: moment(),
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('hhmmss'),
            orderId: e._id,
            payment: 'Adjustment',
            type: 'Adjustment',
            uid: userId,
          });
        }
      }
    }
  });
  console.log(totalAmount);
  billadj = await BillAdjustment.findByIdAndUpdate({ _id: billadj._id }, { un_Billed_amt: totalAmount }, { new: true });
  // let billadjss = await BillAdjustment.findOne({ shopId: id });

  return billadj;
};

const adjustment_bill_pay = async (id, userId, body) => {
  // console.log(id)
  let billadj = await BillAdjustment.findOne({ shopId: id });
  totalAmount = body.amount;
  if (billadj.un_Billed_amt < body.amount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Amount Available');
  }
  if (body.orders.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Available');
  }
  let shoporder = await ShopOrderClone.aggregate([
    {
      $match: {
        $and: [
          { shopId: { $eq: id } },
          { status: { $eq: 'Delivered' } },
          { statusOfBill: { $eq: 'Pending' } },
          { _id: { $in: body.orders } },
        ],
      },
    },
    {
      $sort: { date: 1 },
    },
    {
      $lookup: {
        from: 'orderpayments',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $group: { _id: null, price: { $sum: '$paidAmt' } },
          },
        ],
        as: 'paymentData',
      },
    },
    {
      $unwind: {
        path: '$paymentData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'shoporderclones',
        localField: 'RE_order_Id',
        foreignField: '_id',
        pipeline: [
          {
            $lookup: {
              from: 'orderpayments',
              localField: '_id',
              foreignField: 'orderId',
              pipeline: [
                {
                  $group: {
                    _id: null,
                    amount: {
                      $sum: '$paidAmt',
                    },
                  },
                },
              ],
              as: 'orderpayments',
            },
          },
          {
            $unwind: {
              path: '$orderpayments',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              amount: '$orderpayments.amount',
            },
          },
        ],
        as: 'shoporderclones',
      },
    },
    {
      $unwind: {
        path: '$shoporderclones',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        reorderamount: { $ifNull: ['$shoporderclones.amount', 0] },
      },
    },
    {
      $lookup: {
        from: 'productorderclones',
        localField: '_id',
        foreignField: 'orderId',
        pipeline: [
          {
            $project: {
              Amount: { $multiply: ['$finalQuantity', '$finalPricePerKg'] },
              GST_Number: 1,
            },
          },
          {
            $project: {
              sum: '$sum',
              percentage: {
                $divide: [
                  {
                    $multiply: ['$GST_Number', '$Amount'],
                  },
                  100,
                ],
              },
              value: '$Amount',
            },
          },
          {
            $project: {
              price: { $sum: ['$value', '$percentage'] },
              value: '$value',
              GST: '$percentage',
            },
          },
          { $group: { _id: null, price: { $sum: '$price' } } },
        ],
        as: 'productData',
      },
    },
    {
      $unwind: {
        path: '$productData',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        paidAmount: { $sum: ['$paymentData.price', '$reorderamount'] },
      },
    },
    {
      $project: {
        _id: 1,
        OrderId: 1,
        created: 1,
        paidAmount: 1,
        totalAmount: '$productData.price',
        pendingAmount: { $round: { $subtract: ['$productData.price', '$paidAmount'] } },
      },
    },
  ]);
  // console.log(shoporder)
  if (shoporder.length == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pending Bill Not Available');
  }

  shoporder.forEach(async (e) => {
    if (totalAmount > 0) {
      let pendingAmount = e.pendingAmount;
      if (pendingAmount > 0) {
        let reduceAmount = totalAmount - pendingAmount;
        if (reduceAmount >= 0) {
          totalAmount = totalAmount - pendingAmount;
          console.log(pendingAmount, 'asdasda');
          await ShopOrderClone.findByIdAndUpdate({ _id: e._id }, { statusOfBill: 'Paid' }, { new: true });
          await OrderPayment.create({
            paidAmt: pendingAmount,
            created: moment(),
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('hhmmss'),
            orderId: e._id,
            payment: 'Adjustment',
            type: 'Adjustment',
            uid: userId,
          });
        } else {
          console.log(reduceAmount, 'asdas');
          console.log(totalAmount, 'asdas');
          reduceAmount = totalAmount;
          totalAmount = 0;
          await OrderPayment.create({
            paidAmt: reduceAmount,
            created: moment(),
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('hhmmss'),
            orderId: e._id,
            payment: 'Adjustment',
            type: 'Adjustment',
            uid: userId,
          });
        }
      }
    }
  })
  console.log(totalAmount)
  billadj = await BillAdjustment.findByIdAndUpdate({ _id: billadj._id }, { un_Billed_amt: billadj.un_Billed_amt - body.amount }, { new: true });
  // let billadjss = await BillAdjustment.findOne({ shopId: id });

  return billadj;
};

module.exports = {
  createBill_Adjustment,
  getBillAdjustment_ById,
  getCustomer_bills,
  adjustment_bill,
  adjustment_bill_pay,
};
