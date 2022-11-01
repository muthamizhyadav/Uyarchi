const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const BillAdjustment = require('../models/Bill.Adj.model');
const AdjbillHistories = require('../models/Adj.Bill.history.model');
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
        as: 'shoporder',
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
