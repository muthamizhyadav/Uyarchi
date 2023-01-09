const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const purchasePlan = require('../services/purchasePlan.service');


const create_purchase_plan = catchAsync(async (req, res) => {
    const value = await purchasePlan.create_purchase_plan(req);
    if (!value) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Created');
    }
    res.status(httpStatus.CREATED).send(value);
  });

module.exports ={
    create_purchase_plan
}