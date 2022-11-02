const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const BillAdjustment = require('../models/Bill.Adj.model');
const AdjbillHistories = require('../models/Adj.Bill.history.model');
const { ShopOrder, ProductorderSchema, ShopOrderClone, ProductorderClone } = require('../models/shopOrder.model');

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

const getCustomer_bills = async (id) => {
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
    {
      $project: {
        _id: 1,
        shopId: 1,
        un_Billed_amt: 1,
        payment_method: 1,
        date: 1,
        shopName: '$shopdata.SName',
        pendingAmount: '$shoporder.pendingAmount',
      },
    },
  ]);
  return values;
};

module.exports = {
  createBill_Adjustment,
  getBillAdjustment_ById,
  getCustomer_bills,
};
