const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { RaisedUnBilled, RaisedUnBilledHistory } = require('../models/supplier.raised.unbilled.model');
const moment = require('moment');

const createRaisedUnbilled = async (body) => {
  const { supplierId, raised_Amt } = body;
  const data = await RaisedUnBilled.findOne({ supplierId: supplierId });
  if (!data) {
    let values = { ...body, ...{ created: moment(), date: moment().format('YYYY-MM-DD') } };
    const create = await RaisedUnBilled.create(values);
    await RaisedUnBilledHistory.create({
      ...body,
      ...{ created: moment(), date: moment().format('YYYY-MM-DD'), raisedId: create._id },
    });
    return create;
  } else {
    let prevamt = data.raised_Amt;
    let newamt = parseInt(raised_Amt);
    let total = prevamt + newamt;
    let value = await RaisedUnBilled.findByIdAndUpdate({ _id: data._id }, { raised_Amt: total }, { new: true });
    await RaisedUnBilledHistory.create({
      ...body,
      ...{ created: moment(), date: moment().format('YYYY-MM-DD'), raisedId: data._id },
    });
    return value;
  }
};

const getRaisedSupplier = async () => {
  let values = await RaiseSupplierAmount.aggregate([
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
      $lookup: {
        from: 'supplierunbilleds',
        localField: 'supplierId',
        foreignField: 'supplierId',
        as: 'unbilled',
      },
    },
    {
      $unwind: '$unbilled',
    },
  ]);
  return values;
};

module.exports = { createRaisedUnbilled, getRaisedSupplier };
